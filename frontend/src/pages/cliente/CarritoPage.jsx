
import { Link } from 'react-router-dom';
import { useCarrito } from '../../context/CarritoContext.jsx';

function formatearPrecio(precio) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(Number(precio) || 0);
}

function CarritoPage() {
  const {
    items,
    totalUnidades,
    total,
    cambiarCantidad,
    eliminarProducto,
    vaciarCarrito,
  } = useCarrito();

  return (
    <main className="container py-4 py-md-5">
      <header className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h1 className="display-6 fw-bold">Mi carrito</h1>
          <p className="text-secondary mb-0">
            Revisa los productos que seleccionaste.
          </p>
        </div>

        <Link to="/catalogo" className="btn btn-outline-primary">
          Seguir comprando
        </Link>
      </header>

      {items.length === 0 ? (
        <section className="text-center border rounded-4 p-5">
          <div className="display-3 mb-3" aria-hidden="true">
            🛒
          </div>

          <h2 className="h4 fw-bold">Tu carrito está vacío</h2>

          <p className="text-secondary">
            Explora el catálogo y agrega tus productos favoritos.
          </p>

          <Link to="/catalogo" className="btn btn-primary">
            Ir al catálogo
          </Link>
        </section>
      ) : (
        <div className="row g-4">
          <section className="col-12 col-lg-8">
            <p className="text-secondary">
              {totalUnidades}{' '}
              {totalUnidades === 1 ? 'unidad seleccionada' : 'unidades seleccionadas'}
            </p>

            <div className="d-flex flex-column gap-3">
              {items.map((item) => (
                <article
                  key={item.codigo}
                  className="card border-0 shadow-sm"
                >
                  <div className="card-body p-3 p-md-4">
                    <div className="row g-3 align-items-center">
                      <div className="col-12 col-md">
                        <p className="small text-secondary mb-1">
                          Código: {item.codigo}
                        </p>

                        <h2 className="h5 fw-bold">{item.nombre}</h2>

                        <p className="small text-secondary">
                          {item.marca}
                          {item.modelo ? ` · ${item.modelo}` : ''}
                        </p>

                        <p className="fw-semibold text-primary mb-0">
                          {formatearPrecio(item.precio)} por unidad
                        </p>
                      </div>

                      <div className="col-7 col-md-3">
                        <label
                          htmlFor={`cantidad-${item.codigo}`}
                          className="form-label small"
                        >
                          Cantidad
                        </label>

                        <input
                          id={`cantidad-${item.codigo}`}
                          type="number"
                          className="form-control"
                          min="1"
                          max={Number(item.stock) || 1}
                          step="1"
                          value={item.cantidad}
                          onChange={(evento) => {
                            cambiarCantidad(
                              item.codigo,
                              evento.target.value
                            );
                          }}
                        />

                        <small className="text-secondary">
                          Stock: {item.stock}
                        </small>
                      </div>

                      <div className="col-5 col-md-3 text-end">
                        <p className="small text-secondary mb-1">
                          Subtotal
                        </p>

                        <p className="fw-bold">
                          {formatearPrecio(
                            Number(item.precio) * item.cantidad
                          )}
                        </p>

                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => eliminarProducto(item.codigo)}
                        >
                          Quitar
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <button
              type="button"
              className="btn btn-outline-danger mt-3"
              onClick={vaciarCarrito}
            >
              Vaciar carrito
            </button>
          </section>

          <aside className="col-12 col-lg-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h2 className="h5 fw-bold mb-4">Resumen de compra</h2>

                <div className="d-flex justify-content-between mb-3">
                  <span>Unidades</span>
                  <span>{totalUnidades}</span>
                </div>

                <div className="d-flex justify-content-between border-top pt-3">
                  <span className="fw-bold">Total</span>
                  <span className="h5 fw-bold text-primary">
                    {formatearPrecio(total)}
                  </span>
                </div>

                <p className="small text-secondary mt-3 mb-0">
                  El despacho se definirá durante el proceso de pedido.
                </p>
              </div>
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}

export default CarritoPage;
