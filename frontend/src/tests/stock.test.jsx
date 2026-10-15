import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import ControlStockPage from "../pages/vendedor/ControlStockPage"

describe("ControlStockPage", () => {

  it("renderiza los productos", () => {
    render(<ControlStockPage />)

    expect(
      screen.getByText("Guitarra Fender Stratocaster")
    ).toBeInTheDocument()

    expect(
      screen.getByText("Micrófono Shure SM58")
    ).toBeInTheDocument()
  })


  it("permite buscar productos", async () => {
    const user = userEvent.setup()

    render(<ControlStockPage />)

    const buscador = screen.getByPlaceholderText("Ej: guitarra")

    await user.type(buscador, "Shure")

    expect(
      screen.getByText("Micrófono Shure SM58")
    ).toBeInTheDocument()

    expect(
      screen.queryByText("Guitarra Fender Stratocaster")
    ).not.toBeInTheDocument()
  })

})


it("permite aumentar el stock", async () => {
  const user = userEvent.setup()

  render(<ControlStockPage />)

  const botonesAumentar = screen.getAllByRole(
    "button",
    { name: "+" }
  )

  await user.click(botonesAumentar[0])

  const filaProducto = screen
    .getByText("Guitarra Fender Stratocaster")
    .closest("tr")

  expect(filaProducto).toHaveTextContent("5")
})

it("no permite disminuir el stock cuando está en cero", () => {
  render(<ControlStockPage />)

  const botonesDisminuir = screen.getAllByRole(
    "button",
    { name: "-" }
  )

  const ultimoBoton = botonesDisminuir[
    botonesDisminuir.length - 1
  ]

  expect(ultimoBoton).toBeDisabled()
})
it("muestra mensaje cuando no existen coincidencias", async () => {
  const user = userEvent.setup()

  render(<ControlStockPage />)

  const buscador = screen.getByPlaceholderText("Ej: guitarra")

  await user.type(
    buscador,
    "producto inexistente"
  )

  expect(
    screen.getByText("No se encontraron productos.")
  ).toBeInTheDocument()
})