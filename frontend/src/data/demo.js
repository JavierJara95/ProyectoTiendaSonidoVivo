import productos from "./admin/productos.json";
import { localDate } from "../utils/format";
export { default as demoUsers } from "./usuarios.json";
export const DEMO_PASSWORD = "Sonido2026!";
export function createDemoOrders() {
  // Pedidos sintéticos: los precios y códigos proceden del Excel, las ventas no.
  const states = [
    "entregado",
    "despachado",
    "en preparación",
    "entregado",
    "cancelado",
    "en preparación",
  ];
  return Array.from({ length: 18 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i * 2);
    const product = productos[(i * 3) % productos.length];
    const cantidad = i % 3 === 0 ? 2 : 1;
    return {
      id: `SV-${String(1040 + i).padStart(4, "0")}`,
      clienteId: "usr-cliente",
      clienteNombre: "Valentina",
      fecha: localDate(date),
      estado: states[i % states.length],
      estadoPago: i % 7 === 0 ? "pendiente" : "aprobado",
      tipoEntrega: i % 3 === 0 ? "retiro" : "despacho",
      transportista: i % 2 ? "Starken" : "Chilexpress",
      numeroSeguimiento: i % 6 === 1 ? `DEMO-${1040 + i}` : "",
      items: [
        {
          codigo: product.codigo,
          nombre: product.nombre,
          categoria: product.categoria,
          cantidad,
          precioUnitario: product.precio,
        },
      ],
      total: product.precio * cantidad,
    };
  });
}
