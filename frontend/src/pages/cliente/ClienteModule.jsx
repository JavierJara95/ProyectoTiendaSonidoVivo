import { Navigate, Route, Routes } from 'react-router-dom';
import { CarritoProvider } from '../../context/CarritoContext.jsx';
import CarritoPage from './CarritoPage.jsx';
import CatalogoPage from './CatalogoPage.jsx';
import DetalleProductoPage from './DetalleProductoPage.jsx';
import PedidoConfirmadoPage from './PedidoConfirmadoPage.jsx';
import SeguimientoPedidoPage from './SeguimientoPedidoPage.jsx';

/**
 * Entrada aislada del módulo cliente para montarla desde el router común en
 * una ruta /cliente/*. No crea otro BrowserRouter ni depende de páginas ajenas.
 */
export default function ClienteModule() {
  return (
    <CarritoProvider>
      <Routes>
        <Route index element={<Navigate to="catalogo" replace />} />
        <Route path="catalogo" element={<CatalogoPage />} />
        <Route path="producto/:codigo" element={<DetalleProductoPage />} />
        <Route path="carrito" element={<CarritoPage />} />
        <Route path="pedido-confirmado/:folio" element={<PedidoConfirmadoPage />} />
        <Route path="seguimiento" element={<SeguimientoPedidoPage />} />
        <Route path="*" element={<Navigate to="catalogo" replace />} />
      </Routes>
    </CarritoProvider>
  );
}
