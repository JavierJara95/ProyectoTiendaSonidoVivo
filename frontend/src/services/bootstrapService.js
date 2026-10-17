import productos from "../data/admin/productos.json";
import { demoUsers, DEMO_PASSWORD, createDemoOrders } from "../data/demo";
import { KEYS } from "../utils/constants";
import { hashPassword } from "../utils/password";
import { writeStorage } from "../utils/storage";
let initializing;
export function initializeDemo() {
  if (!initializing)
    initializing = (async () => {
      if (!localStorage.getItem(KEYS.users)) {
        const users = await Promise.all(
          demoUsers.map(async (user) => ({
            ...user,
            credential: await hashPassword(DEMO_PASSWORD),
            createdAt: new Date().toISOString(),
          })),
        );
        // Una segunda comprobación evita sobreescribir datos creados durante la inicialización.
        if (!localStorage.getItem(KEYS.users)) writeStorage(KEYS.users, users);
      }
      if (!localStorage.getItem(KEYS.products))
        writeStorage(KEYS.products, productos);
      if (!localStorage.getItem(KEYS.orders))
        writeStorage(KEYS.orders, createDemoOrders());
    })().catch((error) => {
      initializing = undefined;
      throw error;
    });
  return initializing;
}
