import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom"

import VendedorLayout from "../components/vendedor/VendedorLayout"

import GestionPedidosPage from "../pages/vendedor/GestionPedidosPage"
import ControlStockPage from "../pages/vendedor/ControlStockPage"
import UbicacionTiendaPage from "../pages/vendedor/UbicacionTiendaPage"

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={
            <Navigate
              to="/vendedor/pedidos"
              replace
            />
          }
        />

        <Route
          path="/vendedor"
          element={<VendedorLayout />}
        >

          <Route
            path="pedidos"
            element={<GestionPedidosPage />}
          />

          <Route
            path="stock"
            element={<ControlStockPage />}
          />

          <Route
            path="ubicacion"
            element={<UbicacionTiendaPage />}
          />

        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter