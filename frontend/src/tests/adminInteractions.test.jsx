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
describe("Interacciones de administración y registro", () => {
  it("crea un usuario desde el formulario y actualiza el listado", async () => {
    await seed();
    renderAt(<GestionUsuariosPage />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Crear usuario" }));
    await user.type(screen.getByLabelText("Nombre completo"), "Ana Música");
    await user.type(
      screen.getByLabelText("Correo electrónico"),
      "ana@correo.cl",
    );
    await user.type(screen.getByLabelText("Contraseña inicial"), "Musica2026!");
    await user.click(screen.getByRole("button", { name: "Guardar usuario" }));
    await waitFor(() =>
      expect(screen.getByText("ana@correo.cl")).toBeVisible(),
    );
    expect(screen.getByRole("status")).toHaveTextContent("Usuario creado.");
  });
  it("desactiva una cuenta solo después de confirmar", async () => {
    await seed();
    renderAt(<GestionUsuariosPage />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Desactivar Javier" }));
    expect(screen.getByRole("dialog")).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Confirmar" }));
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "Activar Javier" }),
      ).toBeVisible(),
    );
    expect(screen.getByRole("status")).toHaveTextContent(
      "Usuario desactivado.",
    );
  });
  it("el registro exige coincidencia de contraseñas y aceptación", async () => {
    renderAt(<RegistroPage />);
    const user = userEvent.setup();
    await user.type(
      screen.getByLabelText("Contraseña", { exact: true }),
      "Musica2026!",
    );
    await user.type(screen.getByLabelText("Confirmar contraseña"), "Otra2026!");
    await user.click(screen.getByRole("button", { name: "Crear cuenta" }));
    expect(screen.getByText("Las contraseñas no coinciden.")).toBeVisible();
    expect(
      screen.getByText("Debes aceptar las condiciones de uso."),
    ).toBeVisible();
  });
  it("rechaza un período de reporte invertido y deja la exportación deshabilitada sin ventas", async () => {
    await seed();
    renderAt(<ReportesVentasPage />);
    const user = userEvent.setup();
    expect(screen.getByRole("button", { name: "Exportar CSV" })).toBeDisabled();
    await user.clear(screen.getByLabelText("Desde"));
    await user.type(screen.getByLabelText("Desde"), "2026-10-15");
    await user.clear(screen.getByLabelText("Hasta"));
    await user.type(screen.getByLabelText("Hasta"), "2026-10-01");
    await user.click(screen.getByRole("button", { name: "Aplicar período" }));
    expect(screen.getByRole("alert")).toHaveTextContent(
      "La fecha inicial no puede ser posterior",
    );
  });
});
