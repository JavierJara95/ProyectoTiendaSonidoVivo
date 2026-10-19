import { describe, it, expect } from "vitest";
import {
  createUser,
  registerUser,
  updateUser,
  setUserActive,
  listUsers,
} from "../services/usuariosService";
import { login } from "../services/authService";
import { KEYS } from "../utils/constants";
import { DEMO_PASSWORD } from "../data/demo";
import { seed, userValues } from "./helpers";
describe("Gestión de usuarios", () => {
  it("crea un usuario persistido con contraseña derivada y rol asignado", async () => {
    await seed();
    const result = await createUser(userValues);
    expect(result.rol).toBe("vendedor");
    expect(listUsers()).toHaveLength(4);
    const stored = localStorage.getItem(KEYS.users);
    expect(stored).not.toContain(userValues.password);
    expect(stored).not.toContain(DEMO_PASSWORD);
    await expect(
      login(userValues.email, userValues.password),
    ).resolves.toMatchObject({ id: result.id });
  });
  it("rechaza correos duplicados incluso con espacios y mayúsculas", async () => {
    await seed();
    await expect(
      createUser({ ...userValues, email: " ADMIN@SONIDOVIVO.CL " }),
    ).rejects.toThrow("Ya existe");
    expect(listUsers()).toHaveLength(3);
  });
  it("el registro público fuerza el rol cliente", async () => {
    await seed();
    sessionStorage.clear();
    const result = await registerUser({
      ...userValues,
      rol: "admin",
      confirmPassword: userValues.password,
      acceptTerms: true,
    });
    expect(result.rol).toBe("cliente");
  });
  it("valida confirmación de contraseña y consentimiento", async () => {
    await seed();
    await expect(
      registerUser({
        ...userValues,
        confirmPassword: "Distinta2026!",
        acceptTerms: true,
      }),
    ).rejects.toThrow("no coinciden");
    await expect(
      registerUser({
        ...userValues,
        confirmPassword: userValues.password,
        acceptTerms: false,
      }),
    ).rejects.toThrow("aceptar");
  });
  it("edita datos y rol sin perder la contraseña cuando el campo está vacío", async () => {
    await seed();
    await updateUser("usr-cliente", {
      ...userValues,
      password: "",
      rol: "vendedor",
    });
    await expect(login(userValues.email, DEMO_PASSWORD)).resolves.toMatchObject(
      { rol: "vendedor", nombre: userValues.nombre },
    );
  });
  it("desactiva y reactiva una cuenta; la cuenta inactiva no puede ingresar", async () => {
    await seed();
    await setUserActive("usr-cliente", false);
    await expect(login("cliente@sonidovivo.cl", DEMO_PASSWORD)).rejects.toThrow(
      "inactiva",
    );
    await setUserActive("usr-cliente", true);
    await expect(
      login("cliente@sonidovivo.cl", DEMO_PASSWORD),
    ).resolves.toMatchObject({ activo: true });
  });
  it("impide que el administrador desactive su propia cuenta o pierda su rol", async () => {
    await seed();
    await expect(setUserActive("usr-admin", false)).rejects.toThrow(
      "No puedes",
    );
    await expect(
      updateUser("usr-admin", {
        nombre: "Esteban",
        email: "admin@sonidovivo.cl",
        password: "",
        rol: "cliente",
      }),
    ).rejects.toThrow("No puedes");
  });
  it("rechaza un CRUD de usuarios sin permisos", async () => {
    await seed({ role: "cliente" });
    await expect(createUser(userValues)).rejects.toThrow("permiso");
    expect(() => listUsers()).toThrow("permiso");
  });
});
