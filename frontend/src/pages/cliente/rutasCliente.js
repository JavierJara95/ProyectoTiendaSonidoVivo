/**
 * Permite ejecutar el módulo de cliente de forma independiente (rutas en raíz)
 * y montarlo dentro de la aplicación común bajo /cliente/*.
 */
export function rutaCliente(pathname, destino = 'catalogo') {
  const base = /^\/cliente(?:\/|$)/.test(String(pathname || ''))
    ? '/cliente'
    : '';
  const segmento = String(destino || 'catalogo').replace(/^\/+/, '');

  return `${base}/${segmento}`;
}

export function rutaCatalogoCliente(pathname) {
  return rutaCliente(pathname, 'catalogo');
}
