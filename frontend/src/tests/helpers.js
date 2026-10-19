import { hashPassword } from "../utils/password";
import { KEYS } from "../utils/constants";
import { writeStorage } from "../utils/storage";
import { demoUsers, DEMO_PASSWORD } from "../data/demo";
import productos from "../data/admin/productos.json";
export async function seed({
  role = "admin",
  activo = true,
  orders = [],
} = {}) {
  const credential = await hashPassword(DEMO_PASSWORD);
  const users = demoUsers.map((user) => ({
    ...user,
    credential,
    activo: user.rol === role ? activo : user.activo,
  }));
  writeStorage(KEYS.users, users);
  writeStorage(KEYS.products, productos);
  writeStorage(KEYS.orders, orders);
  const user = users.find((item) => item.rol === role);
  sessionStorage.setItem(
    KEYS.session,
    JSON.stringify({
      userId: user.id,
      token: "token-de-prueba",
      expiresAt: Date.now() + 60000,
    }),
  );
  return users;
}
export const userValues = {
  nombre: "Ana Música",
  email: "ana@correo.cl",
  password: "Musica2026!",
  rol: "vendedor",
};
