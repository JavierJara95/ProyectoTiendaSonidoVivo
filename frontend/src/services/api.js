// Cliente único HTTP para los tres microservicios de Sonido Vivo.
const SERVICES = {
  catalogo: import.meta.env.VITE_CATALOGO_URL || 'http://localhost:8081',
  pedidos: import.meta.env.VITE_PEDIDOS_URL || 'http://localhost:8082',
  auth: import.meta.env.VITE_AUTH_URL || 'http://localhost:8083',
};
const SESSION_KEY = 'sonido-vivo:v1:sesion';
export function storedSession() {
  try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null'); }
  catch { return null; }
}
export function clearStoredSession() {
  sessionStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event('sonido-vivo:datos-actualizados'));
}
export function sessionToken() {
  const session = storedSession();
  if (!session?.token || !session.expiresAt || session.expiresAt <= Date.now()) {
    if (session) clearStoredSession();
    return null;
  }
  return session.token;
}
export async function request(service, path, { method = 'GET', body, signal } = {}) {
  const token = sessionToken();
  const headers = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;
  let response;
  try {
    response = await fetch(`${SERVICES[service]}${path}`, {
      method, headers, body: body === undefined ? undefined : JSON.stringify(body), signal,
    });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new Error(`No se pudo conectar con ${service} (${SERVICES[service]}). Comprueba que el microservicio esté iniciado.`);
  }
  const raw = await response.text();
  let data = null;
  try { data = raw ? JSON.parse(raw) : null; } catch { data = raw; }
  if (!response.ok) {
    // Una respuesta 401 del backend puede significar token caducado/revocado.
    // Nunca cerrar sesión por un 403 (solo permiso insuficiente).
    if (response.status === 401 && token) clearStoredSession();
    const detail = typeof data === 'object' ? (data?.mensaje || data?.message || data?.detail || data?.error) : data;
    const error = new Error(typeof detail === 'string' && detail !== 'Unauthorized'
      ? detail : `Solicitud rechazada (HTTP ${response.status}).`);
    error.status = response.status;
    throw error;
  }
  return data;
}
