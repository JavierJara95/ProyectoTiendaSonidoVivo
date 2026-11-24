import { demoUsers } from '../data/demo';
import { KEYS } from '../utils/constants';
import { installMockBackend } from './mockBackend';
export async function seed({ role = 'admin', activo = true, orders = [] } = {}) {
  const users = demoUsers.map(u => ({ ...u, activo: u.rol === role ? activo : u.activo }));
  installMockBackend({ users, orders });
  const user = users.find(u => u.rol === role);
  sessionStorage.setItem(KEYS.session, JSON.stringify({
    token: 'JWT_SIMULADO_SOLO_TEST', expiresAt: Date.now() + 600000, user,
  }));
  return users;
}
export const userValues = { nombre: 'Ana Música', email: 'ana@correo.cl', password: 'Musica2026!', rol: 'vendedor' };
