import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import App from "../App"

describe("Navegación del vendedor", () => {

  it("permite navegar desde pedidos hacia stock", async () => {
    const user = userEvent.setup()

    window.history.pushState(
      {},
      "",
      "/vendedor/pedidos"
    )

    render(<App />)

    expect(
      screen.getByText("Gestión de Pedidos")
    ).toBeInTheDocument()

    await user.click(
      screen.getByRole("link", {
        name: "Stock"
      })
    )

    expect(
      screen.getByText("Control de Stock")
    ).toBeInTheDocument()
  })

})