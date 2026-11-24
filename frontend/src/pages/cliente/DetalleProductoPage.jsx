import { Link, useLocation, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getProductByCode } from '../../services/catalogoService';
import { useCarrito } from '../../context/CarritoContext.jsx';
import { rutaCliente } from './rutasCliente.js';

function formatearPrecio(precio) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(Number(precio) || 0);
}

function DetalleProductoPage() {
  const { codigo } = useParams();
  const location = useLocation();
  const { agregarProducto, totalUnidades } = useCarrito();
  const [mensaje, setMensaje] = useState('');
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true; setLoading(true); setError('');
    getProductByCode(codigo).then(p => { if(active) setProducto(p); })
      .catch(e => { if(active) setError(e.message); })
      .finally(() => { if(active) setLoading(false); });
    return () => { active = false; };
  }, [codigo]);

  if (loading) return <main className="container py-5" role="status">Cargando producto…</main>;

  if (!producto) {
    return (
      <main className="container py-5">
        <h1 className="h3">Producto no encontrado</h1>
        <p>{error || "El producto solicitado no existe en el catálogo."}</p>
        <Link to={rutaCliente(location.pathname, 'catalogo')} className="btn btn-primary">
          Volver al catálogo
        </Link>
      </main>
    );
  }

  function manejarAgregar() {
    const resultado = agregarProducto(producto);
    setMensaje(resultado.mensaje);
  }

  return (
    <main className="container py-4">
      <nav aria-label="Ruta de navegación" className="mb-4">
        <Link to={rutaCliente(location.pathname, 'catalogo')}>Catálogo</Link>
        {' / '}
        <span>{producto.nombre}</span>
      </nav>

      <div className="row g-4">
        <section className="col-12 col-md-7">
          <p className="text-secondary mb-1">
            Código: {producto.codigo}
          </p>

          <h1 className="h2">{producto.nombre}</h1>

          <p className="text-secondary">
            {producto.marca} · Modelo {producto.modelo}
          </p>

          <hr />

          <h2 className="h5">Descripción</h2>
          <p>{producto.descripcion || 'Sin descripción disponible.'}</p>

          <h2 className="h5 mt-4">Especificaciones</h2>
          <dl className="row">
            <dt className="col-sm-4">Categoría</dt>
            <dd className="col-sm-8">{producto.categoria}</dd>

            <dt className="col-sm-4">Marca</dt>
            <dd className="col-sm-8">{producto.marca}</dd>

            <dt className="col-sm-4">Modelo</dt>
            <dd className="col-sm-8">{producto.modelo}</dd>

            <dt className="col-sm-4">Código</dt>
            <dd className="col-sm-8">{producto.codigo}</dd>
          </dl>
        </section>

        <aside className="col-12 col-md-5">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="h4">Precio</h2>

              <p className="display-6 fw-bold">
                {formatearPrecio(producto.precio)}
              </p>

              <p>
                <strong>Stock disponible:</strong>{' '}
                {producto.stock} unidades
              </p>

              <button
                type="button"
                className="btn btn-primary w-100"
                onClick={manejarAgregar}
                disabled={Number(producto.stock) <= 0}
              >
                {Number(producto.stock) > 0
                  ? 'Agregar al carrito'
                  : 'Sin stock'}
              </button>

              {mensaje && (
                <p role="status" className="mt-3 mb-0">
                  {mensaje}
                </p>
              )}

              <Link
                to={rutaCliente(location.pathname, 'carrito')}
                className="btn btn-outline-secondary w-100 mt-3"
              >
                Ver carrito ({totalUnidades})
              </Link>
            </div>
          </div>
        </aside>
      </div>

      <Link to={rutaCliente(location.pathname, 'catalogo')} className="btn btn-outline-secondary mt-4">
        Volver al catálogo
      </Link>
    </main>
  );
}

export default DetalleProductoPage;