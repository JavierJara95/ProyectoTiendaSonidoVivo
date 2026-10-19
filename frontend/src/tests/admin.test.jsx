import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";
import RegistroPage from "../pages/auth/RegistroPage";
import GestionUsuariosPage from "../pages/admin/GestionUsuariosPage";
import ReportesVentasPage from "../pages/admin/ReportesVentasPage";
import { AppRoutes } from "../routes/AppRouter";
import { useAuth } from "../context/AuthContext";
import { seed } from "./helpers";
vi.mock("../context/AuthContext", () => ({ useAuth: vi.fn() }));
function renderAt(element, route = "/") {
  return render(
    <MemoryRouter initialEntries={[route]}>{element}</MemoryRouter>,
  );
}
beforeEach(() => {
  useAuth.mockReturnValue({
    ready: true,
    user: { id: "usr-admin", nombre: "Esteban González", rol: "admin" },
    login: vi.fn(),
    logout: vi.fn(),
  });
});
describe("Componentes y rutas del módulo Esteban", () => {
  it("muestra validaciones de login sin llamar al servicio con datos incompletos", async () => {
    const login = vi.fn();
    useAuth.mockReturnValue({ login });
    renderAt(<LoginPage />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Iniciar sesión" }));
    expect(
      screen.getByText("Ingresa un correo electrónico válido."),
    ).toBeVisible();
    expect(screen.getByText("Ingresa tu contraseña.")).toBeVisible();
    expect(login).not.toHaveBeenCalled();
  });
  it("redirige al login cuando una ruta administrativa se abre sin sesión", () => {
    useAuth.mockReturnValue({ ready: true, user: null, login: vi.fn() });
    renderAt(<AppRoutes />, "/admin/usuarios");
    expect(
      screen.getByRole("heading", { name: "Qué bueno verte." }),
    ).toBeVisible();
  });
  it("rechaza una ruta administrativa para el rol vendedor", () => {
    useAuth.mockReturnValue({
      ready: true,
      user: { id: "usr-vendedor", nombre: "Javier", rol: "vendedor" },
      logout: vi.fn(),
    });
    renderAt(<AppRoutes />, "/admin/usuarios");
    expect(
      screen.getByRole("heading", { name: "No tienes acceso a esta sección." }),
    ).toBeVisible();
    expect(
      screen.queryByRole("heading", { name: "Usuarios del sistema" }),
    ).not.toBeInTheDocument();
  });
  it("renderiza usuarios y filtra por nombre y rol", async () => {
    await seed();
    renderAt(<GestionUsuariosPage />);
    const user = userEvent.setup();
    expect(screen.getByText("admin@sonidovivo.cl")).toBeVisible();
    await user.type(
      screen.getByRole("textbox", { name: "Buscar usuarios" }),
      "Javier",
    );
    expect(screen.getByText("vendedor@sonidovivo.cl")).toBeVisible();
    expect(screen.queryByText("admin@sonidovivo.cl")).not.toBeInTheDocument();
    await user.selectOptions(
      screen.getByRole("combobox", { name: "Filtrar por rol" }),
      "cliente",
    );
    expect(
      screen.getByText("No hay usuarios que coincidan con los filtros."),
    ).toBeVisible();
  });
});
