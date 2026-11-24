import { KEYS } from '../utils/constants';
import { request, storedSession, sessionToken, clearStoredSession } from './api';
import { notifySessionChanged } from '../utils/storage';
import { normalizeEmail, validateLogin, assertValid } from '../utils/validaciones';
export const publicUser = (user) => user;
export function getCurrentUser() {
  if (!sessionToken()) return null;
  const session = storedSession();
  return session?.user?.activo ? session.user : null;
}
export function requireAdmin() {
  const user = getCurrentUser();
  if (user?.rol !== 'admin') throw new Error('No tienes permiso para realizar esta operación.');
  return user;
}
export async function login(email, password) {
  assertValid(validateLogin({ email, password }));
  const response = await request('auth', '/api/auth/login', {
    method: 'POST', body: { email: normalizeEmail(email), password },
  });
  if (!response?.token || !response?.user || !response?.expiresAt)
    throw new Error('El servidor no devolvió una sesión JWT válida.');
  sessionStorage.setItem(KEYS.session, JSON.stringify({
    token: response.token, expiresAt: response.expiresAt, user: response.user,
  }));
  notifySessionChanged();
  return response.user;
}
export async function restoreSession() {
  if (!sessionToken()) return null;
  try {
    const user = await request('auth', '/api/auth/me');
    const session = storedSession();
    if (!session) return null;
    sessionStorage.setItem(KEYS.session, JSON.stringify({ ...session, user }));
    notifySessionChanged();
    return user;
  } catch {
    logout();
    return null;
  }
}
export function logout() { clearStoredSession(); notifySessionChanged(); }
