import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";
import ControlStockPage from "../pages/vendedor/ControlStockPage";

const mock = vi.hoisted(() => ({
  products: [
    {id:1,codigo:'TEST-1',nombre:'Guitarra Fender Stratocaster',categoria:'Guitarras',stock:4,precio:100},
    {id:2,codigo:'TEST-2',nombre:'Micrófono Shure SM58',categoria:'Micrófonos',stock:3,precio:200},
    {id:3,codigo:'TEST-3',nombre:'Pedal Boss DS-1',categoria:'Pedales',stock:0,precio:300},
  ],
}));
vi.mock('../services/catalogoService', () => ({
  listProducts: vi.fn(async () => mock.products.map(p=>({...p}))),
  changeStock: vi.fn(async (product,quantity) => {
    const stored=mock.products.find(p=>p.id===product.id);
    stored.stock=quantity;
    return {...stored};
  }),
}));
beforeEach(() => {mock.products[0].stock=4;mock.products[1].stock=3;mock.products[2].stock=0;});
async function renderStock() {
  render(<ControlStockPage/>);
  await screen.findByText('Guitarra Fender Stratocaster');
}

describe("ControlStockPage integrado", () => {
  it("renderiza los productos", async () => {
    await renderStock();
    expect(screen.getByText("Guitarra Fender Stratocaster")).toBeInTheDocument();
    expect(screen.getByText("Micrófono Shure SM58")).toBeInTheDocument();
  });

  it("permite buscar productos", async () => {
    const user = userEvent.setup();
    await renderStock();
    const buscador = screen.getByPlaceholderText("Ej: guitarra");
    await user.type(buscador, "Shure");
    expect(screen.getByText("Micrófono Shure SM58")).toBeInTheDocument();
    expect(screen.queryByText("Guitarra Fender Stratocaster")).not.toBeInTheDocument();
  });

  it("permite aumentar el stock", async () => {
    const user = userEvent.setup();
    await renderStock();
    await user.click(screen.getByRole("button", { name: /aumentar stock de guitarra fender/i }));
    const fila = screen.getByText("Guitarra Fender Stratocaster").closest("tr");
    await waitFor(() => expect(fila).toHaveTextContent("5"));
  });

  it("no permite disminuir el stock cuando está en cero", async () => {
    await renderStock();
    expect(screen.getByRole("button", { name: /disminuir stock de pedal boss ds-1/i })).toBeDisabled();
  });

  it("muestra mensaje cuando no existen coincidencias", async () => {
    const user = userEvent.setup();
    await renderStock();
    await user.type(screen.getByPlaceholderText("Ej: guitarra"), "producto inexistente");
    expect(screen.getByText("No se encontraron productos.")).toBeInTheDocument();
  });
});
