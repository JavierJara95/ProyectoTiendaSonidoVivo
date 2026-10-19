import { Outlet } from "react-router-dom"
import VendedorNavbar from "./VendedorNavbar"

function VendedorLayout() {
  return (
    <>
      <VendedorNavbar />

      <main>
        <Outlet />
      </main>
    </>
  )
}

export default VendedorLayout