/**
 * Persistencia simulada de pedidos para EP2.
 * La clave coincide con la utilizada por el módulo de vendedor para que
 * ambos módulos lean y actualicen los mismos pedidos en el navegador.
 * En la integración con Spring Boot, esta capa podrá sustituirse por la API REST.
 */
const CLAVE_PEDIDOS = 'sonidoVivo_pedidos';
const CLAVE_PEDIDOS_ANTERIOR = 'sonido-vivo-pedidos';
const TRANSPORTISTAS = ['Starken', 'Chilexpress'];

function leerArrayDesde(clave) {
  try {
    const texto = localStorage.getItem(clave);
    if (!texto) return [];
    const valor = JSON.parse(texto);
    return Array.isArray(valor) ? valor.filter(Boolean) : [];
  } catch {
    return [];
  }
}

function normalizarEntrega(pedido) {
  const entregaOriginal =
    pedido.entrega && typeof pedido.entrega === 'object'
      ? pedido.entrega
      : {};
  const tipoOriginal = String(entregaOriginal.tipo || '').trim().toLowerCase();
  const tipoEntregaOriginal = String(pedido.tipoEntrega || '').trim();
  const transportistaOriginal =
    entregaOriginal.transportista ||
    entregaOriginal.empresa ||
    (TRANSPORTISTAS.includes(tipoEntregaOriginal) ? tipoEntregaOriginal : null);

  const esRetiro =
    tipoOriginal.includes('retiro') ||
    tipoEntregaOriginal.toLowerCase().includes('retiro');
  const tipo = esRetiro ? 'Retiro en tienda' : 'Despacho a domicilio';
  const transportista = esRetiro ? null : transportistaOriginal;

  return {
    ...entregaOriginal,
    tipo,
    transportista,
    direccion: entregaOriginal.direccion || null,
    comuna: entregaOriginal.comuna || null,
    region: entregaOriginal.region || null,
  };
}

function normalizarPedido(pedido, idAlternativo) {
  const clienteOriginal = pedido.cliente;
  const datosClienteOriginal =
    pedido.datosCliente ||
    (clienteOriginal && typeof clienteOriginal === 'object'
      ? clienteOriginal
      : {});
  const nombre = String(
    datosClienteOriginal.nombre ||
    (typeof clienteOriginal === 'string' ? clienteOriginal : '') ||
    ''
  ).trim();
  const correo = String(
    datosClienteOriginal.correo || pedido.correo || ''
  ).trim().toLowerCase();
  const telefono = String(datosClienteOriginal.telefono || '').trim();
  const entrega = normalizarEntrega(pedido);
  const tipoEntrega = entrega.tipo === 'Retiro en tienda'
    ? 'Retiro en tienda'
    : (entrega.transportista || pedido.tipoEntrega || '');

  return {
    ...pedido,
    id: Number.isFinite(Number(pedido.id)) && Number(pedido.id) > 0
      ? Number(pedido.id)
      : idAlternativo,
    cliente: nombre,
    correo,
    datosCliente: { nombre, correo, telefono },
    tipoEntrega,
    estado: pedido.estado || 'En preparación',
    numeroSeguimiento: String(pedido.numeroSeguimiento || ''),
    entrega,
    items: Array.isArray(pedido.items) ? pedido.items : [],
    total: Number.isFinite(Number(pedido.total)) ? Number(pedido.total) : 0,
  };
}

function leerPedidos() {
  // Primero se leen los datos antiguos para poder migrarlos sin perder pedidos.
  const antiguos = leerArrayDesde(CLAVE_PEDIDOS_ANTERIOR);
  const compartidos = leerArrayDesde(CLAVE_PEDIDOS);
  const porIdentificador = new Map();
  let anonimo = 0;

  for (const pedido of [...antiguos, ...compartidos]) {
    const clave = pedido.folio
      ? `folio:${String(pedido.folio).toUpperCase()}`
      : (pedido.id !== undefined && pedido.id !== null
        ? `id:${pedido.id}`
        : `anonimo:${anonimo++}:${JSON.stringify(pedido)}`);
    // Los registros compartidos más recientes prevalecen sobre los antiguos.
    porIdentificador.set(clave, pedido);
  }

  const registros = [...porIdentificador.values()];
  const mayorId = registros.reduce((mayor, pedido) => {
    const id = Number(pedido.id);
    return Number.isFinite(id) ? Math.max(mayor, id) : mayor;
  }, 0);
  let siguienteId = mayorId + 1;

  return registros.map((pedido) => {
    const idAlternativo = siguienteId++;
    return normalizarPedido(pedido, idAlternativo);
  });
}

function guardarPedidos(pedidos) {
  try {
    localStorage.setItem(CLAVE_PEDIDOS, JSON.stringify(pedidos));
    return true;
  } catch {
    return false;
  }
}

function crearFolio() {
  const marcaTiempo = Date.now().toString(36).toUpperCase();
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
    String(pedido.folio || '').trim().toUpperCase() === folioNormalizado &&
    String(pedido.datosCliente?.correo || pedido.correo || '').trim().toLowerCase() === correoNormalizado
  ) || null;
}

export function registrarPedido({ items, cliente, entrega, total }) {
  if (!Array.isArray(items) || items.length === 0) {
    return {
      ok: false,
      mensaje: 'Agrega al menos un producto antes de confirmar el pedido.',
    };
  }

  const nombre = String(cliente?.nombre || '').trim();
  const correo = String(cliente?.correo || '').trim().toLowerCase();
  const telefono = String(cliente?.telefono || '').trim();
  if (!nombre || !correo) {
    return { ok: false, mensaje: 'Completa el nombre y el correo del cliente.' };
  }

  const itemsNormalizados = [];
  for (const item of items) {
    const precio = Number(item.precio);
    const cantidad = Number(item.cantidad);
    const stock = Number(item.stock);
    if (!Number.isFinite(precio) || precio < 0 || !Number.isInteger(cantidad) || cantidad < 1) {
      return { ok: false, mensaje: 'Hay un producto con precio o cantidad inválidos.' };
    }
    if (Number.isFinite(stock) && stock >= 0 && cantidad > stock) {
      return { ok: false, mensaje: `La cantidad de ${item.nombre || 'un producto'} supera el stock disponible.` };
    }

    itemsNormalizados.push({
      codigo: String(item.codigo || ''),
      nombre: String(item.nombre || ''),
      marca: String(item.marca || ''),
      modelo: String(item.modelo || ''),
      precio,
      cantidad,
      subtotal: precio * cantidad,
    });
  }

  const entregaEntrada = entrega && typeof entrega === 'object' ? entrega : {};
  const tipoEntrada = String(entregaEntrada.tipo || '').trim().toLowerCase();
  const esRetiro = tipoEntrada.includes('retiro');
  const transportista = esRetiro
    ? null
    : (entregaEntrada.transportista || entregaEntrada.empresa || null);
  if (!esRetiro && !TRANSPORTISTAS.includes(transportista)) {
    return { ok: false, mensaje: 'Selecciona Starken o Chilexpress para el despacho.' };
  }

  const entregaNormalizada = {
    tipo: esRetiro ? 'Retiro en tienda' : 'Despacho a domicilio',
    transportista,
    direccion: esRetiro ? null : String(entregaEntrada.direccion || '').trim(),
    comuna: esRetiro ? null : String(entregaEntrada.comuna || '').trim(),
    region: esRetiro ? null : String(entregaEntrada.region || '').trim(),
  };
  const pedidos = leerPedidos();
  const siguienteId = pedidos.reduce((mayor, pedido) => {
    const id = Number(pedido.id);
    return Number.isFinite(id) ? Math.max(mayor, id) : mayor;
  }, 0) + 1;
  const totalCalculado = itemsNormalizados.reduce(
    (suma, item) => suma + item.subtotal,
    0
  );

  const pedido = {
    id: siguienteId,
    folio: crearFolio(),
    fecha: new Date().toISOString(),
    cliente: nombre,
    correo,
    datosCliente: { nombre, correo, telefono },
    tipoEntrega: esRetiro ? 'Retiro en tienda' : transportista,
    estado: 'En preparación',
    numeroSeguimiento: '',
    entrega: entregaNormalizada,
    items: itemsNormalizados,
    total: Number.isFinite(totalCalculado) ? totalCalculado : Number(total) || 0,
  };

  if (!guardarPedidos([...pedidos, pedido])) {
    return {
      ok: false,
      mensaje: 'No se pudo guardar el pedido en este navegador. Inténtalo nuevamente.',
    };
  }

  return { ok: true, pedido };
}

export function __limpiarPedidosParaPruebas() {
  localStorage.removeItem(CLAVE_PEDIDOS);
  localStorage.removeItem(CLAVE_PEDIDOS_ANTERIOR);
}
