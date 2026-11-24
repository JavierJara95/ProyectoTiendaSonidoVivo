import { request } from './api';
// Los totales se calculan SOLO en el backend; no se envía precio desde React.
export function createOrder({ items, cliente, entrega }) {
  return request('pedidos', '/api/pedidos', { method: 'POST', body: {
    cliente: { nombre: cliente.nombre, correo: cliente.correo, telefono: cliente.telefono },
    items: items.map(p => ({ productoId: p.id || null, codigo: p.codigo, cantidad: p.cantidad })),
    entrega,
  }});
}
export function myOrders() { return request('pedidos', '/api/pedidos/mis-pedidos'); }
export function allOrders() { return request('pedidos', '/api/pedidos'); }
export function trackOrder(folio) { return request('pedidos', `/api/seguimiento/${encodeURIComponent(folio.trim())}`); }
export function changeOrderState(id, estado, numeroSeguimiento) {
  return request('pedidos', `/api/pedidos/${id}/estado`, { method: 'PUT', body: { estado, numeroSeguimiento } });
}
export function normalizeOrder(p) {
  if (!p) return p;
  return {
    ...p, id: p.id, folio: p.folio,
    fecha: p.fechaCreacion,
    cliente: p.clienteNombre, clienteNombre: p.clienteNombre,
    correo: p.clienteCorreo,
    estado: p.estadoDescripcion,
    numeroSeguimiento: p.entrega?.numeroSeguimiento || '',
    tipoEntrega: p.entrega?.tipo || '',
    items: (p.items || []).map(i => ({ ...i, categoria: i.categoria || 'Sin categoría' })),
  };
}
