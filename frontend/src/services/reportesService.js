import { KEYS } from "../utils/constants";
import { readStorage } from "../utils/storage";
import { requireAdmin } from "./authService";
export function isSale(order) {
  return order.estadoPago === "aprobado" && order.estado !== "cancelado";
}
export function calculateReport(
  orders,
  products,
  { desde = "", hasta = "" } = {},
) {
  const filtered = orders.filter(
    (order) =>
      (!desde || order.fecha.slice(0, 10) >= desde) &&
      (!hasta || order.fecha.slice(0, 10) <= hasta),
  );
  const sales = filtered.filter(isSale);
  const revenue = sales.reduce((sum, order) => sum + order.total, 0);
  const categories = new Map();
  const daily = new Map();
  for (const order of sales) {
    const day = order.fecha.slice(0, 10);
    daily.set(day, (daily.get(day) || 0) + order.total);
    for (const item of order.items) {
      const category =
        item.categoria ||
        products.find((product) => product.codigo === item.codigo)?.categoria ||
        "Sin categoría";
      const prior = categories.get(category) || {
        categoria: category,
        unidades: 0,
        total: 0,
      };
      categories.set(category, {
        ...prior,
        unidades: prior.unidades + item.cantidad,
        total: prior.total + item.cantidad * item.precioUnitario,
      });
    }
  }
  return {
    orders: filtered,
    sales,
    revenue,
    saleCount: sales.length,
    averageTicket: sales.length ? revenue / sales.length : 0,
    units: sales.reduce(
      (sum, order) =>
        sum + order.items.reduce((count, item) => count + item.cantidad, 0),
      0,
    ),
    byCategory: [...categories.values()].sort((a, b) => b.total - a.total),
    byDay: [...daily]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([fecha, total]) => ({ fecha, total })),
    lowStock: products
      .filter((product) => product.stock <= 3)
      .sort((a, b) => a.stock - b.stock),
    stockUnits: products.reduce((sum, product) => sum + product.stock, 0),
    productCount: products.length,
    inventoryValue: products.reduce(
      (sum, product) => sum + product.stock * product.precio,
      0,
    ),
  };
}
export function getReport(filters) {
  requireAdmin();
  return calculateReport(
    readStorage(KEYS.orders),
    readStorage(KEYS.products),
    filters,
  );
}
export function getProducts() {
  requireAdmin();
  return readStorage(KEYS.products);
}
