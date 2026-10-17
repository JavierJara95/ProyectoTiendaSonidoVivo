import { KEYS } from "../utils/constants";
import { readStorage, notifySessionChanged } from "../utils/storage";
import {
  normalizeEmail,
  validateLogin,
  assertValid,
} from "../utils/validaciones";
import { verifyPassword } from "../utils/password";
export const publicUser = ({ credential: _credential, ...user }) => user;
export function getCurrentUser() {
  try {
    const session = JSON.parse(sessionStorage.getItem(KEYS.session) || "null");
    if (!session?.token || session.expiresAt <= Date.now()) return null;
    const user = readStorage(KEYS.users).find(
      (item) => item.id === session.userId && item.activo,
    );
    return user ? publicUser(user) : null;
  } catch {
    return null;
  }
}
export function requireAdmin() {
  const user = getCurrentUser();
  if (user?.rol !== "admin")
    throw new Error("No tienes permiso para realizar esta operación.");
  return user;
}
export async function login(email, password) {
  assertValid(validateLogin({ email, password }));
  const user = readStorage(KEYS.users).find(
    (item) => item.email === normalizeEmail(email),
  );
  if (!user?.activo || !(await verifyPassword(password, user.credential)))
    throw new Error("Correo o contraseña incorrectos, o cuenta inactiva.");
  // Relee la cuenta tras la operación asíncrona para respetar su estado actual.
  const latest = readStorage(KEYS.users).find(
    (item) => item.id === user.id && item.activo,
  );
  if (!latest || latest.credential.hash !== user.credential.hash)
    throw new Error("La cuenta cambió. Intenta iniciar sesión nuevamente.");
  sessionStorage.setItem(
    KEYS.session,
    JSON.stringify({
      token: crypto.randomUUID(),
      userId: user.id,
      expiresAt: Date.now() + 8 * 60 * 60 * 1000,
    }),
  );
  notifySessionChanged();
  return publicUser(latest);
}
export function logout() {
  sessionStorage.removeItem(KEYS.session);
  notifySessionChanged();
}
