import { describe, it, expect, vi } from "vitest";
import { calculateReport } from "../services/reportesService";
import { salesCsv, downloadCsv } from "../utils/csv";
const products = [
  { codigo: "GA001", categoria: "Guitarras", stock: 2, precio: 100 },
];
const order = {
  id: "SV-1",
  fecha: "2026-10-01",
  clienteNombre: "Ana",
  estado: "entregado",
  estadoPago: "aprobado",
  tipoEntrega: "retiro",
  total: 200,
  items: [
    {
      codigo: "GA001",
      categoria: "Guitarras",
      cantidad: 2,
      precioUnitario: 100,
    },
  ],
};
describe("Reportes de ventas y exportación", () => {
  it("excluye pagos pendientes y pedidos cancelados de los ingresos", () => {
    const result = calculateReport(
      [
        order,
        { ...order, estadoPago: "pendiente" },
        { ...order, estado: "cancelado" },
      ],
      products,
    );
    expect(result.revenue).toBe(200);
    expect(result.saleCount).toBe(1);
    expect(result.orders).toHaveLength(3);
    expect(result.units).toBe(2);
  });
  it("filtra fechas incluyendo ambos extremos del período", () => {
    const result = calculateReport(
      [
        order,
        { ...order, fecha: "2026-10-02", id: "SV-2" },
        { ...order, fecha: "2026-09-30" },
      ],
      products,
      { desde: "2026-10-01", hasta: "2026-10-02" },
    );
    expect(result.saleCount).toBe(2);
    expect(result.averageTicket).toBe(200);
  });
  it("agrupa por categoría y fecha y detecta bajo stock", () => {
    const result = calculateReport([order], products);
    expect(result.byCategory[0]).toEqual({
      categoria: "Guitarras",
      unidades: 2,
      total: 200,
    });
    expect(result.byDay).toEqual([{ fecha: "2026-10-01", total: 200 }]);
    expect(result.lowStock).toHaveLength(1);
    expect(result.inventoryValue).toBe(200);
  });
  it("maneja períodos sin ventas sin producir NaN", () => {
    const result = calculateReport([], products);
    expect(result.revenue).toBe(0);
    expect(result.averageTicket).toBe(0);
    expect(result.byCategory).toEqual([]);
  });
  it("exporta CSV con comillas escapadas y neutraliza fórmulas en texto", () => {
    const csv = salesCsv([
      { ...order, clienteNombre: '=HYPERLINK("ejemplo")' },
    ]);
    expect(csv).toContain(`"'=HYPERLINK(""ejemplo"")"`);
    expect(csv).toContain('"Total CLP"');
    expect(csv.startsWith("\uFEFF")).toBe(true);
  });
  it("descarga un archivo mediante URL temporal usando mocks", () => {
    const create = vi.fn(() => "blob:demo");
    const revoke = vi.fn();
    Object.defineProperty(URL, "createObjectURL", {
      configurable: true,
      value: create,
    });
    Object.defineProperty(URL, "revokeObjectURL", {
      configurable: true,
      value: revoke,
    });
    const click = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => {});
    vi.useFakeTimers();
    downloadCsv([order]);
    expect(create).toHaveBeenCalledWith(expect.any(Blob));
    expect(click).toHaveBeenCalledOnce();
    vi.runAllTimers();
    expect(revoke).toHaveBeenCalledWith("blob:demo");
    vi.useRealTimers();
  });
});
