import { useState } from 'react';
import { Link } from 'react-router-dom';
import { buscarPedido } from '../../data/pedidos.js';

function formatearPrecio(precio) {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(Number(precio) || 0);
}

function SeguimientoPedidoPage() {
  const [folio, setFolio] = useState('');
  const [correo, setCorreo] = useState('');
  const [pedido, setPedido] = useState(null);
  const [mensaje, setMensaje] = useState('');

  function consultarPedido(evento) {
    evento.preventDefault();
    const encontrado = buscarPedido(folio, correo);
    setPedido(encontrado);
    setMensaje(encontrado ? '' : 'No encontramos un pedido con ese folio y correo. Revisa los datos e inténtalo nuevamente.');
  }

  return (
    <main className="container py-4 py-md-5">
      <header className="mb-4">
        <h1 className="display-6 fw-bold">Seguimiento de pedido</h1>
        <p className="text-secondary">Consulta el estado de tu pedido con el folio de confirmación y el correo utilizado al comprar.</p>
      </header>

      <div className="row g-4">
        <section className="col-12 col-lg-6" aria-labelledby="consulta-pedido-titulo">
          <form className="card border-0 shadow-sm" onSubmit={consultarPedido}>
            <div className="card-body p-4">
              <h2 id="consulta-pedido-titulo" className="h5 fw-bold mb-3">Buscar mi pedido</h2>
              <div className="mb-3">
                <label htmlFor="folio-seguimiento" className="form-label">Folio del pedido</label>
                <input id="folio-seguimiento" className="form-control" value={folio} onChange={(e) => setFolio(e.target.value)} required placeholder="Ej.: SV-..." />
              </div>
              <div className="mb-3">
                <label htmlFor="correo-seguimiento" className="form-label">Correo electrónico</label>
                <input id="correo-seguimiento" type="email" className="form-control" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
              </div>
              <button className="btn btn-primary" type="submit">Consultar estado</button>
              {mensaje && <div className="alert alert-warning mt-3 mb-0" role="alert">{mensaje}</div>}
            </div>
          </form>
        </section>

        {pedido && (
          <section className="col-12 col-lg-6" aria-live="polite" aria-labelledby="resultado-seguimiento-titulo">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4">
                <p className="small text-secondary mb-1">Pedido encontrado</p>
                <h2 id="resultado-seguimiento-titulo" className="h4 fw-bold">{pedido.folio}</h2>
                <p>Estado actual: <span className="badge text-bg-primary">{pedido.estado}</span></p>
                <p className="mb-1"><strong>Cliente:</strong> {pedido.cliente.nombre}</p>
                <p className="mb-1"><strong>Fecha:</strong> {new Date(pedido.fecha).toLocaleString('es-CL')}</p>
                <p className="mb-1"><strong>Entrega:</strong> {pedido.entrega.tipo}</p>
                {pedido.entrega.tipo === 'Despacho a domicilio' && <p className="mb-1"><strong>Empresa:</strong> {pedido.entrega.transportista}</p>}
                <p className="fw-bold mt-3">Total: {formatearPrecio(pedido.total)}</p>
                <h3 className="h6 fw-bold mt-4">Productos</h3>
                <ul className="list-group list-group-flush">
                  {pedido.items.map((item) => <li key={item.codigo} className="list-group-item px-0 d-flex justify-content-between gap-3"><span>{item.nombre} × {item.cantidad}</span><span>{formatearPrecio(item.subtotal)}</span></li>)}
                </ul>
              </div>
            </div>
          </section>
        )}
      </div>
      <div className="d-flex flex-wrap gap-2 mt-4">
        <Link to="/catalogo" className="btn btn-outline-primary">Volver al catálogo</Link>
        <Link to="/carrito" className="btn btn-outline-secondary">Ir al carrito</Link>
      </div>
    </main>
  );
}

export default SeguimientoPedidoPage;
