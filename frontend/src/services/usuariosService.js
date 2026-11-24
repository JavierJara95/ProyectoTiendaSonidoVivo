import { request } from './api';
import { requireAdmin } from './authService';
import { validateUser, validateRegistration, assertValid, normalizeEmail } from '../utils/validaciones';
export async function listUsers() {
  requireAdmin();
  return request('auth', '/api/usuarios');
}
export async function createUser(values) {
  requireAdmin(); assertValid(validateUser(values));
  return request('auth', '/api/usuarios', { method: 'POST', body: {
    nombre: values.nombre.trim(), email: normalizeEmail(values.email),
    password: values.password, rol: values.rol, activo: true,
  }});
}
export async function registerUser(values) {
  assertValid(validateRegistration(values));
  return request('auth', '/api/auth/register', { method: 'POST', body: {
    nombre: values.nombre.trim(), email: normalizeEmail(values.email), password: values.password,
  }});
}
export async function updateUser(id, values) {
  requireAdmin(); assertValid(validateUser(values, { requirePassword: false }));
  return request('auth', `/api/usuarios/${id}`, { method: 'PUT', body: {
    nombre: values.nombre.trim(), email: normalizeEmail(values.email),
    password: values.password || null, rol: values.rol, activo: values.activo ?? null,
  }});
}
export async function setUserActive(id, activo) {
  requireAdmin();
  return request('auth', `/api/usuarios/${id}/estado`, { method: 'PATCH', body: { activo } });
}
