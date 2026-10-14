
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import productos from '../../data/productos.json';
import { useCarrito } from '../../context/CarritoContext.jsx';

function formatearPrecio(precio) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(Number(precio) || 0);
}

function CatalogoPage() {
  const [busqueda, setBusqueda] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] =
    useState('Todas');
  const [mensaje, setMensaje] = useState('');

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

  const productosFiltrados = useMemo(() => {
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

      return coincideBusqueda && coincideCategoria;
    });
  }, [busqueda, categoriaSeleccionada]);

  function manejarAgregar(producto) {
    const resultado = agregarProducto(producto);
    setMensaje(resultado.mensaje);
  }

  return (
    <main className="container py-4 py-md-5">
      <header className="mb-4">
        <p className="text-uppercase text-primary fw-semibold mb-2">
          Tienda de instrumentos y sonido
        </p>

        <h1 className="display-5 fw-bold">Nuestro catálogo</h1>

        <p className="text-secondary mb-0">
          Explora nuestros instrumentos musicales, equipos de sonido
          y accesorios.
        </p>
      </header>

      <div className="d-flex justify-content-end mb-3">
        <Link to="/carrito" className="btn btn-outline-primary">
          🛒 Ver carrito ({totalUnidades})
        </Link>
      </div>

      {mensaje && (
        <div className="alert alert-info" role="status">
          {mensaje}
        </div>
      )}

      <section
        className="bg-light rounded-4 p-3 p-md-4 mb-4"
        aria-label="Buscar y filtrar productos"
      >
        <div className="row g-3">
          <div className="col-12 col-md-7">
            <label
              htmlFor="buscar-producto"
              className="form-label fw-semibold"
            >
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

          <div className="col-12 col-md-5">
            <label
              htmlFor="filtrar-categoria"
              className="form-label fw-semibold"
            >
              Categoría
            </label>

            <select
              id="filtrar-categoria"
              className="form-select"
              value={categoriaSeleccionada}
              onChange={(evento) =>
                setCategoriaSeleccionada(evento.target.value)
              }
            >
              {categorias.map((categoria) => (
                <option key={categoria} value={categoria}>
                  {categoria}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h2 className="h5 fw-bold mb-0">Productos del catálogo</h2>

        <span className="badge text-bg-secondary">
          {productosFiltrados.length}{' '}
          {productosFiltrados.length === 1 ? 'producto' : 'productos'}
        </span>
      </div>

      {productosFiltrados.length > 0 ? (
        <div className="row g-3 g-md-4">
          {productosFiltrados.map((producto) => {
            const stock = Number(producto.stock) || 0;
            const disponible = stock > 0;

            return (
              <div
                className="col-12 col-sm-6 col-lg-4"
                key={producto.codigo}
              >
                <article className="card h-100 border-0 shadow-sm">
                  <div className="card-body d-flex flex-column p-4">
                    <div className="d-flex justify-content-between align-items-start gap-2 mb-3">
                      <span className="badge text-bg-light border text-wrap">
                        {producto.categoria}
                      </span>

                      <span
                        className={`badge ${
                          disponible ? 'text-bg-success' : 'text-bg-danger'
                        }`}
                      >
                        {disponible ? 'Disponible' : 'Sin stock'}
                      </span>
                    </div>

                    <p className="small text-secondary mb-1">
                      Código: {producto.codigo}
                    </p>

                    <h3 className="h5 fw-bold mb-2">
                      {producto.nombre}
                    </h3>

                    <p className="text-secondary small mb-2">
                      {producto.marca}
                      {producto.modelo ? ` · ${producto.modelo}` : ''}
                    </p>

                    <p className="small mb-3">
                      {producto.descripcion}
                    </p>

                    <div className="mt-auto pt-3 border-top">
                      <p className="h4 fw-bold text-primary mb-2">
                        {formatearPrecio(producto.precio)}
                      </p>

                      <p className="small text-secondary mb-0">
                        {disponible
                          ? `Stock: ${stock} unidad${stock === 1 ? '' : 'es'}`
                          : 'Consulta por disponibilidad'}
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
            Prueba con otro término o selecciona otra categoría.
          </p>

          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={() => {
              setBusqueda('');
              setCategoriaSeleccionada('Todas');
              setMensaje('');
            }}
          >
            Limpiar filtros
          </button>
        </div>
      )}
    </main>
  );
}

export default CatalogoPage;
