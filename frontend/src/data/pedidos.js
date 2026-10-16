const CLAVE_PEDIDOS = 'sonido-vivo-pedidos';

function leerPedidos() {
  try {
    const guardados = localStorage.getItem(CLAVE_PEDIDOS);
    const pedidos = guardados ? JSON.parse(guardados) : [];
    return Array.isArray(pedidos) ? pedidos : [];
  } catch {
    return [];
  }
}

function guardarPedidos(pedidos) {
  localStorage.setItem(CLAVE_PEDIDOS, JSON.stringify(pedidos));
}

function crearFolio() {
  const fecha = new Date();
  const marcaTiempo = fecha.getTime().toString(36).toUpperCase();
  const aleatorio = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `SV-${marcaTiempo}-${aleatorio}`;
}

export function listarPedidos() {
  return leerPedidos();
}

export function buscarPedido(folio, correo) {
  const folioNormalizado = String(folio || '').trim().toUpperCase();
  const correoNormalizado = String(correo || '').trim().toLowerCase();
  if (!folioNormalizado || !correoNormalizado) return null;

  return leerPedidos().find((pedido) =>
    pedido.folio.toUpperCase() === folioNormalizado &&
    pedido.cliente.correo.toLowerCase() === correoNormalizado
  ) || null;
}

export function registrarPedido({ items, cliente, entrega, total }) {
  if (!Array.isArray(items) || items.length === 0) {
    return { ok: false, mensaje: 'Agrega al menos un producto antes de confirmar el pedido.' };
  }

  const pedido = {
    folio: crearFolio(),
    fecha: new Date().toISOString(),
    estado: 'En preparación',
    cliente: {
      nombre: cliente.nombre.trim(),
      correo: cliente.correo.trim().toLowerCase(),
      telefono: cliente.telefono.trim(),
    },
    entrega: { ...entrega },
    items: items.map((item) => ({
      codigo: item.codigo,
      nombre: item.nombre,
      marca: item.marca,
      modelo: item.modelo,
      precio: Number(item.precio),
      cantidad: Number(item.cantidad),
      subtotal: Number(item.precio) * Number(item.cantidad),
    })),
    total: Number(total),
  };

  const pedidos = leerPedidos();
  pedidos.push(pedido);
  guardarPedidos(pedidos);
  return { ok: true, pedido };
}

export function __limpiarPedidosParaPruebas() {
  localStorage.removeItem(CLAVE_PEDIDOS);
}
