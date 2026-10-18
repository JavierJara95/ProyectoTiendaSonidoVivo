import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import productos from '../../data/productos.json';
import { useCarrito } from '../../context/CarritoContext.jsx';
import { rutaCliente } from './rutasCliente.js';

function formatearPrecio(precio) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(Number(precio) || 0);
}

function CatalogoPage() {
  const [busqueda, setBusqueda] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas');
  const [precioMinimo, setPrecioMinimo] = useState('');
  const [precioMaximo, setPrecioMaximo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const location = useLocation();
  const { agregarProducto, totalUnidades } = useCarrito();

  const categorias = useMemo(() => {
    const lista = [
      ...new Set(
        productos
          .map((producto) => producto.categoria)
          .filter(Boolean)
      ),
    ];

    return ['Todas', ...lista.sort((a, b) => a.localeCompare(b, 'es'))];
  }, []);

  const minimo = precioMinimo.trim() === '' ? null : Number(precioMinimo);
  const maximo = precioMaximo.trim() === '' ? null : Number(precioMaximo);
  const rangoPrecioInvalido =
    (minimo !== null && (!Number.isFinite(minimo) || minimo < 0)) ||
    (maximo !== null && (!Number.isFinite(maximo) || maximo < 0)) ||
    (minimo !== null && maximo !== null && minimo > maximo);

  const productosFiltrados = useMemo(() => {
    if (rangoPrecioInvalido) return [];

    const termino = busqueda.trim().toLocaleLowerCase('es');

    return productos.filter((producto) => {
      const coincideBusqueda = [
        producto.codigo,
        producto.nombre,
        producto.marca,
        producto.modelo,
      ].some((dato) =>
        String(dato ?? '').toLocaleLowerCase('es').includes(termino)
      );

      const coincideCategoria =
        categoriaSeleccionada === 'Todas' ||
        producto.categoria === categoriaSeleccionada;

      const precio = Number(producto.precio);
      const coincidePrecioMinimo = minimo === null || precio >= minimo;
      const coincidePrecioMaximo = maximo === null || precio <= maximo;

      return (
        coincideBusqueda &&
        coincideCategoria &&
        coincidePrecioMinimo &&
        coincidePrecioMaximo
      );
    });
  }, [busqueda, categoriaSeleccionada, minimo, maximo, rangoPrecioInvalido]);

  function manejarAgregar(producto) {
    const resultado = agregarProducto(producto);
    setMensaje(resultado.mensaje);
  }

  function limpiarFiltros() {
    setBusqueda('');
    setCategoriaSeleccionada('Todas');
    setPrecioMinimo('');
    setPrecioMaximo('');
    setMensaje('');
  }

  return (
    <main className="container py-4 py-md-5">
      <header className="mb-4">
        <p className="text-uppercase text-primary fw-semibold mb-2">
          Tienda de instrumentos y sonido
        </p>
        <h1 className="display-5 fw-bold">Nuestro catálogo</h1>
        <p className="text-secondary mb-0">
          Explora nuestros instrumentos musicales, equipos de sonido y accesorios.
        </p>
      </header>

      <div className="d-flex justify-content-end mb-3">
        <Link
          to={rutaCliente(location.pathname, 'carrito')}
          className="btn btn-outline-primary"
        >
          🛒 Ver carrito ({totalUnidades})
        </Link>
      </div>

      {mensaje && <div className="alert alert-info" role="status">{mensaje}</div>}

      <section
        className="bg-light rounded-4 p-3 p-md-4 mb-4"
        aria-label="Buscar y filtrar productos"
      >
        <div className="row g-3">
          <div className="col-12 col-lg-6">
            <label htmlFor="buscar-producto" className="form-label fw-semibold">
              Buscar productos
            </label>
            <input
              id="buscar-producto"
              type="search"
              className="form-control"
              placeholder="Nombre, marca, modelo o código..."
              value={busqueda}
              onChange={(evento) => setBusqueda(evento.target.value)}
            />
          </div>

          <div className="col-12 col-lg-6">
            <label htmlFor="filtrar-categoria" className="form-label fw-semibold">
              Categoría
            </label>
            <select
              id="filtrar-categoria"
              className="form-select"
              value={categoriaSeleccionada}
              onChange={(evento) => setCategoriaSeleccionada(evento.target.value)}
            >
              {categorias.map((categoria) => (
                <option key={categoria} value={categoria}>{categoria}</option>
              ))}
            </select>
          </div>

          <div className="col-12 col-md-6">
            <label htmlFor="precio-minimo" className="form-label fw-semibold">
              Precio mínimo (CLP)
            </label>
            <input
              id="precio-minimo"
              type="number"
              className="form-control"
              min="0"
              step="1"
              inputMode="numeric"
              placeholder="Sin mínimo"
              value={precioMinimo}
              onChange={(evento) => setPrecioMinimo(evento.target.value)}
              aria-invalid={rangoPrecioInvalido}
            />
          </div>

          <div className="col-12 col-md-6">
            <label htmlFor="precio-maximo" className="form-label fw-semibold">
              Precio máximo (CLP)
            </label>
            <input
              id="precio-maximo"
              type="number"
              className="form-control"
              min="0"
              step="1"
              inputMode="numeric"
              placeholder="Sin máximo"
              value={precioMaximo}
              onChange={(evento) => setPrecioMaximo(evento.target.value)}
              aria-invalid={rangoPrecioInvalido}
            />
          </div>
        </div>

        {rangoPrecioInvalido && (
          <p className="alert alert-warning mt-3 mb-0" role="alert">
            Ingresa precios iguales o mayores que cero y asegúrate de que el precio mínimo no supere al máximo.
          </p>
        )}
      </section>

      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h2 className="h5 fw-bold mb-0">Productos del catálogo</h2>
        <span className="badge text-bg-secondary">
          {productosFiltrados.length} {productosFiltrados.length === 1 ? 'producto' : 'productos'}
        </span>
      </div>

      {productosFiltrados.length > 0 ? (
        <div className="row g-3 g-md-4">
          {productosFiltrados.map((producto) => {
            const stock = Number(producto.stock) || 0;
            const disponible = stock > 0;
            const rutaDetalle = rutaCliente(
              location.pathname,
              `producto/${encodeURIComponent(producto.codigo)}`
            );

            return (
              <div className="col-12 col-sm-6 col-lg-4" key={producto.codigo}>
                <article className="card h-100 border-0 shadow-sm">
                  <div className="card-body d-flex flex-column p-4">
                    <div className="d-flex justify-content-between align-items-start gap-2 mb-3">
                      <span className="badge text-bg-light border text-wrap">{producto.categoria}</span>
                      <span className={`badge ${disponible ? 'text-bg-success' : 'text-bg-danger'}`}>
                        {disponible ? 'Disponible' : 'Sin stock'}
                      </span>
                    </div>

                    <p className="small text-secondary mb-1">Código: {producto.codigo}</p>
                    <h3 className="h5 fw-bold mb-2">
                      <Link
                        to={rutaDetalle}
                        className="text-decoration-none text-dark"
                        aria-label={`Ver detalle de ${producto.nombre}`}
                      >
                        {producto.nombre}
                      </Link>
                    </h3>
                    <Link to={rutaDetalle} className="small text-primary mb-2">
                      Ver detalle del producto
                    </Link>
                    <p className="text-secondary small mb-2">
                      {producto.marca}{producto.modelo ? ` · ${producto.modelo}` : ''}
                    </p>
                    <p className="small mb-3">{producto.descripcion}</p>

                    <div className="mt-auto pt-3 border-top">
                      <p className="h4 fw-bold text-primary mb-2">{formatearPrecio(producto.precio)}</p>
                      <p className="small text-secondary mb-0">
                        {disponible ? `Stock: ${stock} unidad${stock === 1 ? '' : 'es'}` : 'Consulta por disponibilidad'}
                      </p>
                      <button
                        type="button"
                        className="btn btn-primary w-100 mt-3"
                        disabled={!disponible}
                        onClick={() => manejarAgregar(producto)}
                      >
                        {disponible ? 'Agregar al carrito' : 'Sin stock'}
                      </button>
                    </div>
                  </div>
                </article>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center border rounded-4 p-5">
          <h3 className="h5 fw-bold">No encontramos productos</h3>
          <p className="text-secondary mb-3">
            {rangoPrecioInvalido
              ? 'Corrige el rango de precios para continuar.'
              : 'Prueba con otro término o selecciona otros filtros.'}
          </p>
          <button type="button" className="btn btn-outline-primary" onClick={limpiarFiltros}>
            Limpiar filtros
          </button>
        </div>
      )}
    </main>
  );
}

export default CatalogoPage;
