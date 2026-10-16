
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import { CarritoProvider } from '../context/CarritoContext.jsx';
import CatalogoPage from '../pages/cliente/CatalogoPage.jsx';
import CarritoPage from '../pages/cliente/CarritoPage.jsx';
import DetalleProductoPage from '../pages/cliente/DetalleProductoPage.jsx';
import PedidoConfirmadoPage from '../pages/cliente/PedidoConfirmadoPage.jsx';
import SeguimientoPedidoPage from '../pages/cliente/SeguimientoPedidoPage.jsx';

function AppRouter() {
  return (
    <CarritoProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/catalogo" replace />}
          />

          <Route
            path="/catalogo"
            element={<CatalogoPage />}
          />

          <Route
            path="/producto/:codigo"
            element={<DetalleProductoPage />}
          />

          <Route
            path="/carrito"
            element={<CarritoPage />}
          />

          {/* El folio identifica el pedido recién confirmado */}
          <Route
            path="/pedido-confirmado/:folio"
            element={<PedidoConfirmadoPage />}
          />

          <Route
            path="/seguimiento"
            element={<SeguimientoPedidoPage />}
          />

          <Route
            path="*"
            element={<Navigate to="/catalogo" replace />}
          />
        </Routes>
      </BrowserRouter>
    </CarritoProvider>
  );
}

export default AppRouter;
