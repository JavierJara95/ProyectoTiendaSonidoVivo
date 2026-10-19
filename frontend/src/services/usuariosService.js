import { KEYS } from "../utils/constants";
import { readStorage, writeStorage } from "../utils/storage";
import { hashPassword } from "../utils/password";
import {
  validateUser,
  validateRegistration,
  assertValid,
  normalizeEmail,
} from "../utils/validaciones";
import { requireAdmin, publicUser } from "./authService";
function ensureUnique(users, email, exceptId) {
  if (users.some((user) => user.email === email && user.id !== exceptId))
    throw new Error("Ya existe un usuario con ese correo.");
}
export function listUsers() {
  requireAdmin();
  return readStorage(KEYS.users).map(publicUser);
}
export async function createUser(values) {
  requireAdmin();
  assertValid(validateUser(values));
  const email = normalizeEmail(values.email);
  const credential = await hashPassword(values.password);
  requireAdmin();
  const users = readStorage(KEYS.users);
  ensureUnique(users, email);
  const user = {
    id: crypto.randomUUID(),
    nombre: values.nombre.trim(),
    email,
    rol: values.rol,
    activo: true,
    credential,
    createdAt: new Date().toISOString(),
  };
  writeStorage(KEYS.users, [...users, user]);
  return publicUser(user);
}
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
export async function updateUser(id, values) {
  const actor = requireAdmin();
  assertValid(validateUser(values, { requirePassword: false }));
  const credential = values.password
    ? await hashPassword(values.password)
    : null;
  requireAdmin();
  const users = readStorage(KEYS.users);
  const current = users.find((user) => user.id === id);
  if (!current) throw new Error("El usuario ya no existe.");
  const email = normalizeEmail(values.email);
  ensureUnique(users, email, id);
  const updated = {
    ...current,
    nombre: values.nombre.trim(),
    email,
    rol: values.rol,
    activo: values.activo ?? current.activo,
    ...(credential ? { credential } : {}),
  };
  if (id === actor.id && (!updated.activo || updated.rol !== "admin"))
    throw new Error(
      "No puedes desactivar tu cuenta ni quitarte el rol de administrador.",
    );
  const next = users.map((user) => (user.id === id ? updated : user));
  if (!next.some((user) => user.activo && user.rol === "admin"))
    throw new Error("Debe existir al menos un administrador activo.");
  writeStorage(KEYS.users, next);
  return publicUser(updated);
}
export async function setUserActive(id, activo) {
  requireAdmin();
  const current = readStorage(KEYS.users).find((user) => user.id === id);
  if (!current) throw new Error("El usuario ya no existe.");
  return updateUser(id, { ...current, activo, password: "" });
}
