import { describe, it, expect } from "vitest";
import {
  getCurrentUser,
  login,
  logout,
  requireAdmin,
} from "../services/authService";
import { seed } from "./helpers";
import { KEYS } from "../utils/constants";
import { DEMO_PASSWORD } from "../data/demo";
describe("Autenticación y sesión", () => {
  it("permite iniciar sesión con correo normalizado y nunca expone la credencial", async () => {
    await seed();
    sessionStorage.clear();
    const user = await login(" ADMIN@SONIDOVIVO.CL ", DEMO_PASSWORD);
    expect(user.rol).toBe("admin");
    expect(user).not.toHaveProperty("credential");
    expect(getCurrentUser().id).toBe(user.id);
  });
  it("rechaza una contraseña incorrecta sin abrir una sesión", async () => {
    await seed();
    sessionStorage.clear();
    await expect(login("admin@sonidovivo.cl", "Otra2026!")).rejects.toThrow(
      "incorrectos",
    );
    expect(getCurrentUser()).toBeNull();
  });
  it("rechaza una cuenta inactiva aunque la contraseña sea correcta", async () => {
    await seed({ activo: false });
    sessionStorage.clear();
    await expect(login("admin@sonidovivo.cl", DEMO_PASSWORD)).rejects.toThrow(
      "inactiva",
    );
  });
  it("invalida la sesión vencida", async () => {
    await seed();
    const session = JSON.parse(sessionStorage.getItem(KEYS.session));
    session.expiresAt = Date.now() - 1;
    sessionStorage.setItem(KEYS.session, JSON.stringify(session));
    expect(getCurrentUser()).toBeNull();
  });
  it("rechaza operaciones administrativas para un vendedor", async () => {
    await seed({ role: "vendedor" });
    expect(() => requireAdmin()).toThrow("permiso");
  });
  it("el cierre de sesión elimina el acceso", async () => {
    await seed();
    logout();
    expect(getCurrentUser()).toBeNull();
    expect(sessionStorage.getItem(KEYS.session)).toBeNull();
  });
});
