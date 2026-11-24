import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi, beforeEach } from "vitest"

import GestionPedidosPage from "../pages/vendedor/GestionPedidosPage"

const mock = vi.hoisted(() => ({ orders: [] }));
const original = () => [
 {id:1001,folio:'SV-1001',cliente:'Ana',correo:'ana@example.com',estado:'En preparación',tipoEntrega:'Retiro en tienda',total:10000,numeroSeguimiento:'',entrega:{modalidad:'RETIRO_TIENDA'}},
 {id:1002,folio:'SV-1002',cliente:'Javier',correo:'javier@example.com',estado:'Despachado',tipoEntrega:'Chilexpress',total:20000,numeroSeguimiento:'CHX0001',entrega:{modalidad:'DESPACHO_DOMICILIO'}},
 {id:1003,folio:'SV-1003',cliente:'Valentina',correo:'val@example.com',estado:'Entregado',tipoEntrega:'Retiro en tienda',total:5000,numeroSeguimiento:'',entrega:{modalidad:'RETIRO_TIENDA'}},
];
vi.mock('../services/pedidosService', () => ({
  allOrders:vi.fn(async () => mock.orders.map(o=>({...o}))),
  normalizeOrder:vi.fn(order => order),
  changeOrderState:vi.fn(async (id,estado,tracking) => {
    const found=mock.orders.find(o=>o.id===id);
    found.estado=({EN_PREPARACION:'En preparación',DESPACHADO:'Despachado',ENTREGADO:'Entregado'})[estado];
    found.numeroSeguimiento=tracking||'';
    return {...found};
  }),
}));
import {changeOrderState} from '../services/pedidosService';
beforeEach(() => {mock.orders=original();vi.clearAllMocks();});
async function renderPedidos(){render(<GestionPedidosPage/>);await screen.findByText('Pedido #1001');}

describe("GestionPedidosPage", () => {

  it("renderiza la lista de pedidos", async () => {
    await renderPedidos()

    expect(
      screen.getByText("Pedido #1001")
    ).toBeInTheDocument()

    expect(
      screen.getByText("Pedido #1002")
    ).toBeInTheDocument()
  })


it("permite cambiar el estado de un pedido", async () => {
  const user = userEvent.setup()

  await renderPedidos()

  const selectorEstado =
    screen.getByRole(
      "combobox",
      {
        name: "Estado pedido 1001"
      }
    )

  await user.selectOptions(
    selectorEstado,
    "Despachado"
  )

  await waitFor(()=>expect(selectorEstado).toHaveValue("Despachado"))
})

})

it("permite ingresar un número de seguimiento", async () => {
  const user = userEvent.setup()

  await renderPedidos()

  const inputs = screen.getAllByPlaceholderText("Ej: CHX458921")

  await user.clear(inputs[0])

  await user.type(
    inputs[0],
    "STK123456"
  )

  expect(inputs[0]).toHaveValue("STK123456")
})

it("envía el cambio de estado al microservicio de pedidos", async () => {
  const user = userEvent.setup()

  await renderPedidos()

  const selectorEstado = screen.getByLabelText(
    "Estado pedido 1001"
  )

  await user.selectOptions(
    selectorEstado,
    "Despachado"
  )

  await waitFor(() => {
    expect(changeOrderState).toHaveBeenCalledWith(1001,"DESPACHADO",null)
  })
})
it("permite filtrar pedidos por estado", async () => {

  const user = userEvent.setup()

  await renderPedidos()

  const filtro = screen.getByLabelText(
    "Filtrar por estado"
  )

  await user.selectOptions(
    filtro,
    "Despachado"
  )

  expect(
    screen.getByText("Pedido #1002")
  ).toBeInTheDocument()

  expect(
    screen.queryByText("Pedido #1001")
  ).not.toBeInTheDocument()

})

it("muestra el resumen de pedidos", async () => {

  await renderPedidos()

  const tarjetaTotal = screen
    .getByText("Pedidos registrados")
    .closest("article")

  expect(tarjetaTotal).toHaveTextContent("Total")
  expect(tarjetaTotal).toHaveTextContent("3")

  expect(
    screen.getByText("Despachados")
  ).toBeInTheDocument()

  expect(
    screen.getByText("Entregados")
  ).toBeInTheDocument()

})