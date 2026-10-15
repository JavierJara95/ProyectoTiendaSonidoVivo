import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import GestionPedidosPage from "../pages/vendedor/GestionPedidosPage"

describe("GestionPedidosPage", () => {

  it("renderiza la lista de pedidos", () => {
    render(<GestionPedidosPage />)

    expect(
      screen.getByText("Pedido #1001")
    ).toBeInTheDocument()

    expect(
      screen.getByText("Pedido #1002")
    ).toBeInTheDocument()
  })


  it("permite cambiar el estado de un pedido", async () => {
    const user = userEvent.setup()

    render(<GestionPedidosPage />)

    const selects = screen.getAllByRole("combobox")

    await user.selectOptions(
      selects[0],
      "Despachado"
    )

    expect(selects[0]).toHaveValue("Despachado")
  })

})

it("permite ingresar un número de seguimiento", async () => {
  const user = userEvent.setup()

  render(<GestionPedidosPage />)

  const inputs = screen.getAllByPlaceholderText("Ej: CHX458921")

  await user.clear(inputs[0])

  await user.type(
    inputs[0],
    "STK123456"
  )

  expect(inputs[0]).toHaveValue("STK123456")
})

it("guarda los pedidos modificados en localStorage", async () => {
  const user = userEvent.setup()

  render(<GestionPedidosPage />)

  const selects = screen.getAllByRole("combobox")

  await user.selectOptions(
    selects[0],
    "Despachado"
  )

  const datosGuardados = JSON.parse(
    localStorage.getItem("sonidoVivo_pedidos")
  )

  expect(
    datosGuardados[0].estado
  ).toBe("Despachado")
})