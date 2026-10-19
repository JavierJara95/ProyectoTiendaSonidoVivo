import { Link, useLocation, useParams } from 'react-router-dom';
import { rutaCliente } from './rutasCliente.js';

function formatearPrecio(precio) {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(Number(precio) || 0);
}

function PedidoConfirmadoPage() {
  const { folio } = useParams();
  const location = useLocation();
  const pedidoDesdeNavegacion = location.state?.pedido;
  // El resumen con datos personales solo se muestra durante la navegación de confirmación.
  // Para consultar el pedido después, se exige folio y correo en la vista de seguimiento.
  const pedido = pedidoDesdeNavegacion?.folio === folio ? pedidoDesdeNavegacion : null;

  return (
    <main className="container py-5">
      <section className="card border-0 shadow-sm mx-auto" style={{ maxWidth: '760px' }}>
        <div className="card-body p-4 p-md-5 text-center">
          <div className="display-4 text-success mb-3" aria-hidden="true">✓</div>
          <h1 className="h2 fw-bold">¡Pedido registrado!</h1>
          <p className="text-secondary">Tu pedido quedó registrado en esta demostración. Guarda el folio para consultar su estado.</p>
          <div className="alert alert-success" role="status">
            <span className="d-block small">Folio del pedido</span>
            <strong className="fs-4">{folio}</strong>
          </div>
          {pedido && (
            <div className="text-start border rounded-3 p-3 mb-4">
              <h2 className="h5 fw-bold">Resumen</h2>
              <p className="mb-1"><strong>Nombre:</strong> {pedido.datosCliente?.nombre || pedido.cliente}</p>
              <p className="mb-1"><strong>Correo:</strong> {pedido.datosCliente?.correo || pedido.correo}</p>
              <p className="mb-1"><strong>Entrega:</strong> {pedido.entrega?.tipo || pedido.tipoEntrega}</p>
              {pedido.entrega?.transportista && <p className="mb-1"><strong>Empresa:</strong> {pedido.entrega?.transportista || pedido.tipoEntrega}</p>}
              <p className="mb-1"><strong>Productos:</strong> {pedido.items.reduce((suma, item) => suma + item.cantidad, 0)} unidades</p>
              <p className="fw-bold mt-2 mb-0">Total: {formatearPrecio(pedido.total)}</p>
            </div>
          )}
          <div className="d-flex flex-wrap justify-content-center gap-2">
            <Link to={rutaCliente(location.pathname, 'seguimiento')} className="btn btn-primary">Seguir mi pedido</Link>
            <Link to={rutaCliente(location.pathname, 'catalogo')} className="btn btn-outline-secondary">Volver al catálogo</Link>
          </div>
          <p className="small text-secondary mt-4 mb-0">Los pedidos se almacenan localmente en este navegador. No se ha realizado un pago ni contratado un envío real.</p>
        </div>
      </section>
    </main>
  );
}

export default PedidoConfirmadoPage;
