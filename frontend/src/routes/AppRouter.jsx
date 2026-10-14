
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import { CarritoProvider } from '../context/CarritoContext.jsx';
import CatalogoPage from '../pages/cliente/CatalogoPage.jsx';
import CarritoPage from '../pages/cliente/CarritoPage.jsx';

function AppRouter() {
  return (
    <CarritoProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/catalogo" replace />}
          />

          <Route path="/catalogo" element={<CatalogoPage />} />
          <Route path="/carrito" element={<CarritoPage />} />

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
