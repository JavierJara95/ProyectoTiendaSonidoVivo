import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import { seed } from "./helpers";
import { DEMO_PASSWORD } from "../data/demo";

describe("Flujo con AuthProvider y servicios reales", () => {
  it("inicia sesión, navega por administración y vuelve a login al cerrar sesión", async () => {
    await seed();
    sessionStorage.clear();
    window.history.replaceState({}, "", "/login");
    render(<App />);
    const user = userEvent.setup();
    await screen.findByRole("heading", { name: "Qué bueno verte." });
    await user.type(
      screen.getByLabelText("Correo electrónico"),
      "admin@sonidovivo.cl",
    );
    await user.type(screen.getByLabelText("Contraseña"), DEMO_PASSWORD);
    await user.click(screen.getByRole("button", { name: "Iniciar sesión" }));
    await screen.findByRole("heading", { name: "Hola, Esteban." });
    await user.click(screen.getByRole("link", { name: "Usuarios" }));
    await screen.findByRole("heading", { name: "Usuarios del sistema" });
    await user.click(screen.getByRole("link", { name: "Reportes de ventas" }));
    await screen.findByRole("heading", { name: "Escucha tus números." });
    await user.click(screen.getByRole("button", { name: "Cerrar sesión" }));
    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: "Qué bueno verte." }),
      ).toBeVisible(),
    );
  });
  it("restaura una sesión válida de cliente y rechaza la URL administrativa", async () => {
    await seed({ role: "cliente" });
    window.history.replaceState({}, "", "/admin");
    render(<App />);
    await screen.findByRole("heading", {
      name: "No tienes acceso a esta sección.",
    });
    expect(
      screen.queryByRole("link", { name: "Usuarios" }),
    ).not.toBeInTheDocument();
  });
});
