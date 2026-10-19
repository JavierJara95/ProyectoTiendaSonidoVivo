import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PuntoRetiroCard from "../components/vendedor/PuntoRetiroCard";

describe("PuntoRetiroCard integrado", () => {
  it("muestra la información del punto de retiro", () => {
    render(<PuntoRetiroCard punto={{ id: 1, nombre: "Tienda Principal Sonido Vivo", direccion: "Viña del Mar", tipo: "Tienda principal" }} />);
    expect(screen.getByText("Tienda Principal Sonido Vivo")).toBeInTheDocument();
    expect(screen.getByText(/Viña del Mar/)).toBeInTheDocument();
  });

  it("muestra el tipo de punto recibido por props", () => {
    render(<PuntoRetiroCard punto={{ id: 2, nombre: "Punto de Retiro Centro", direccion: "Centro de Viña del Mar", tipo: "Punto de retiro" }} />);
    expect(screen.getByText("Punto de retiro")).toBeInTheDocument();
  });
});
