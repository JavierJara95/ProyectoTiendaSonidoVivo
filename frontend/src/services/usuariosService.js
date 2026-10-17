import { KEYS } from "../utils/constants";
import { readStorage, writeStorage } from "../utils/storage";
import { hashPassword } from "../utils/password";
import { validateRegistration, assertValid, normalizeEmail } from "../utils/validaciones";
import { publicUser } from "./authService";
function ensureUnique(users, email) { if (users.some(user => user.email === email)) throw new Error("Ya existe un usuario con ese correo."); }
export async function registerUser(values) {
  assertValid(validateRegistration(values));
  const email = normalizeEmail(values.email);
  const credential = await hashPassword(values.password);
  const users = readStorage(KEYS.users);
  ensureUnique(users, email);
  const user = {
    id: crypto.randomUUID(),
    nombre: values.nombre.trim(),
    email,
    rol: "cliente",
    activo: true,
    credential,
    createdAt: new Date().toISOString(),
  };
  writeStorage(KEYS.users, [...users, user]);
  return publicUser(user);
}
