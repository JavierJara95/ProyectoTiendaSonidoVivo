import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import ControlStockPage from "../pages/vendedor/ControlStockPage";

describe("ControlStockPage integrado", () => {
  it("renderiza los productos", () => {
    render(<ControlStockPage />);
    expect(screen.getByText("Guitarra Fender Stratocaster")).toBeInTheDocument();
    expect(screen.getByText("Micrófono Shure SM58")).toBeInTheDocument();
  });

  it("permite buscar productos", async () => {
    const user = userEvent.setup();
    render(<ControlStockPage />);
    const buscador = screen.getByPlaceholderText("Ej: guitarra");
    await user.type(buscador, "Shure");
    expect(screen.getByText("Micrófono Shure SM58")).toBeInTheDocument();
    expect(screen.queryByText("Guitarra Fender Stratocaster")).not.toBeInTheDocument();
  });

  it("permite aumentar el stock", async () => {
    const user = userEvent.setup();
    render(<ControlStockPage />);
    await user.click(screen.getByRole("button", { name: /aumentar stock de guitarra fender/i }));
    const fila = screen.getByText("Guitarra Fender Stratocaster").closest("tr");
    expect(fila).toHaveTextContent("5");
  });

  it("no permite disminuir el stock cuando está en cero", () => {
    render(<ControlStockPage />);
    expect(screen.getByRole("button", { name: /disminuir stock de pedal boss ds-1/i })).toBeDisabled();
  });

  it("muestra mensaje cuando no existen coincidencias", async () => {
    const user = userEvent.setup();
    render(<ControlStockPage />);
    await user.type(screen.getByPlaceholderText("Ej: guitarra"), "producto inexistente");
    expect(screen.getByText("No se encontraron productos.")).toBeInTheDocument();
  });
});
