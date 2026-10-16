import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCarrito } from '../../context/CarritoContext.jsx';
import { registrarPedido } from '../../data/pedidos.js';

function formatearPrecio(precio) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(Number(precio) || 0);
}

const FORMULARIO_INICIAL = {
  nombre: '',
  correo: '',
  telefono: '',
  tipo: 'despacho',
  transportista: 'Starken',
  direccion: '',
  comuna: '',
  region: '',
};

function CarritoPage() {
  const {
    items,
    totalUnidades,
    total,
    cambiarCantidad,
    eliminarProducto,
    vaciarCarrito,
  } = useCarrito();
  const navigate = useNavigate();
  const [formulario, setFormulario] = useState(FORMULARIO_INICIAL);
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState('');

  function cambiarCampo(evento) {
    const { name, value } = evento.target;
    setFormulario((actual) => ({ ...actual, [name]: value }));
    setErrores((actual) => ({ ...actual, [name]: '' }));
    setMensaje('');
  }

  function validarFormulario() {
    const nuevosErrores = {};
    if (!formulario.nombre.trim()) nuevosErrores.nombre = 'Ingresa tu nombre.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formulario.correo.trim())) {
      nuevosErrores.correo = 'Ingresa un correo electrónico válido.';
    }
    if (!/^[+\d\s()-]{8,20}$/.test(formulario.telefono.trim())) {
      nuevosErrores.telefono = 'Ingresa un teléfono válido.';
    }
    if (formulario.tipo === 'despacho') {
      if (!formulario.direccion.trim()) nuevosErrores.direccion = 'Ingresa la dirección de despacho.';
      if (!formulario.comuna.trim()) nuevosErrores.comuna = 'Ingresa la comuna.';
      if (!formulario.region.trim()) nuevosErrores.region = 'Ingresa la región.';
      if (!['Starken', 'Chilexpress'].includes(formulario.transportista)) {
        nuevosErrores.transportista = 'Selecciona una empresa de despacho válida.';
      }
    }
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  }

  function confirmarPedido(evento) {
    evento.preventDefault();
    setMensaje('');
    if (items.length === 0) {
      setMensaje('Tu carrito está vacío. Agrega productos antes de confirmar.');
      return;
    }
    if (!validarFormulario()) return;

    const entrega = formulario.tipo === 'retiro'
      ? { tipo: 'Retiro en tienda', transportista: null, direccion: null, comuna: null, region: null }
      : {
          tipo: 'Despacho a domicilio',
          transportista: formulario.transportista,
          direccion: formulario.direccion.trim(),
          comuna: formulario.comuna.trim(),
          region: formulario.region.trim(),
        };

    const resultado = registrarPedido({
      items,
      cliente: formulario,
      entrega,
      total,
    });

    if (!resultado.ok) {
      setMensaje(resultado.mensaje);
      return;
    }

    vaciarCarrito();
    navigate(`/pedido-confirmado/${resultado.pedido.folio}`, {
      state: { pedido: resultado.pedido },
    });
  }

  return (
    <main className="container py-4 py-md-5">
      <header className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h1 className="display-6 fw-bold">Mi carrito</h1>
          <p className="text-secondary mb-0">Revisa tus productos y completa los datos para confirmar el pedido.</p>
        </div>
        <Link to="/catalogo" className="btn btn-outline-primary">Seguir comprando</Link>
      </header>

      {items.length === 0 ? (
        <section className="text-center border rounded-4 p-5">
          <div className="display-3 mb-3" aria-hidden="true">🛒</div>
          <h2 className="h4 fw-bold">Tu carrito está vacío</h2>
          <p className="text-secondary">Explora el catálogo y agrega tus productos favoritos.</p>
          <Link to="/catalogo" className="btn btn-primary">Ir al catálogo</Link>
        </section>
      ) : (
        <div className="row g-4">
          <section className="col-12 col-lg-7" aria-label="Productos seleccionados">
            <p className="text-secondary">{totalUnidades} {totalUnidades === 1 ? 'unidad seleccionada' : 'unidades seleccionadas'}</p>
            <div className="d-flex flex-column gap-3">
              {items.map((item) => (
                <article key={item.codigo} className="card border-0 shadow-sm">
                  <div className="card-body p-3 p-md-4">
                    <div className="row g-3 align-items-center">
                      <div className="col-12 col-md">
                        <p className="small text-secondary mb-1">Código: {item.codigo}</p>
                        <h2 className="h5 fw-bold">{item.nombre}</h2>
                        <p className="small text-secondary">{item.marca}{item.modelo ? ` · ${item.modelo}` : ''}</p>
                        <p className="fw-semibold text-primary mb-0">{formatearPrecio(item.precio)} por unidad</p>
                      </div>
                      <div className="col-7 col-md-3">
                        <label htmlFor={`cantidad-${item.codigo}`} className="form-label small">Cantidad</label>
                        <input id={`cantidad-${item.codigo}`} type="number" className="form-control" min="1" max={Number(item.stock) || 1} step="1" value={item.cantidad} onChange={(evento) => cambiarCantidad(item.codigo, evento.target.value)} />
                        <small className="text-secondary">Stock: {item.stock}</small>
                      </div>
                      <div className="col-5 col-md-3 text-end">
                        <p className="small text-secondary mb-1">Subtotal</p>
                        <p className="fw-bold">{formatearPrecio(Number(item.precio) * item.cantidad)}</p>
                        <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => eliminarProducto(item.codigo)}>Quitar</button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <button type="button" className="btn btn-outline-danger mt-3" onClick={vaciarCarrito}>Vaciar carrito</button>
          </section>

          <section className="col-12 col-lg-5" aria-labelledby="confirmar-pedido-titulo">
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <h2 className="h5 fw-bold mb-4">Resumen de compra</h2>
                <div className="d-flex justify-content-between mb-3"><span>Unidades</span><span>{totalUnidades}</span></div>
                <div className="d-flex justify-content-between border-top pt-3"><span className="fw-bold">Total productos</span><span className="h5 fw-bold text-primary">{formatearPrecio(total)}</span></div>
                <p className="small text-secondary mt-3 mb-0">El costo de despacho, si corresponde, no está incluido en este total.</p>
              </div>
            </div>

            <form className="card border-0 shadow-sm" onSubmit={confirmarPedido} noValidate>
              <div className="card-body p-4">
                <h2 id="confirmar-pedido-titulo" className="h5 fw-bold mb-3">Datos para confirmar el pedido</h2>
                {mensaje && <div className="alert alert-danger" role="alert">{mensaje}</div>}
                <div className="mb-3">
                  <label htmlFor="nombre" className="form-label">Nombre completo *</label>
                  <input id="nombre" name="nombre" className={`form-control ${errores.nombre ? 'is-invalid' : ''}`} autoComplete="name" value={formulario.nombre} onChange={cambiarCampo} aria-invalid={Boolean(errores.nombre)} />
                  {errores.nombre && <div className="invalid-feedback">{errores.nombre}</div>}
                </div>
                <div className="mb-3">
                  <label htmlFor="correo" className="form-label">Correo electrónico *</label>
                  <input id="correo" name="correo" type="email" className={`form-control ${errores.correo ? 'is-invalid' : ''}`} autoComplete="email" value={formulario.correo} onChange={cambiarCampo} aria-invalid={Boolean(errores.correo)} />
                  {errores.correo && <div className="invalid-feedback">{errores.correo}</div>}
                </div>
                <div className="mb-3">
                  <label htmlFor="telefono" className="form-label">Teléfono *</label>
                  <input id="telefono" name="telefono" type="tel" className={`form-control ${errores.telefono ? 'is-invalid' : ''}`} autoComplete="tel" value={formulario.telefono} onChange={cambiarCampo} aria-invalid={Boolean(errores.telefono)} />
                  {errores.telefono && <div className="invalid-feedback">{errores.telefono}</div>}
                </div>

                <fieldset className="mb-3">
                  <legend className="form-label">¿Cómo quieres recibir tu pedido? *</legend>
                  <div className="form-check">
                    <input className="form-check-input" id="entrega-despacho" type="radio" name="tipo" value="despacho" checked={formulario.tipo === 'despacho'} onChange={cambiarCampo} />
                    <label className="form-check-label" htmlFor="entrega-despacho">Despacho a domicilio</label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" id="entrega-retiro" type="radio" name="tipo" value="retiro" checked={formulario.tipo === 'retiro'} onChange={cambiarCampo} />
                    <label className="form-check-label" htmlFor="entrega-retiro">Retiro en tienda</label>
                  </div>
                </fieldset>

                {formulario.tipo === 'despacho' && (
                  <div className="border rounded-3 p-3 mb-3">
                    <div className="mb-3">
                      <label htmlFor="transportista" className="form-label">Empresa de despacho *</label>
                      <select id="transportista" name="transportista" className={`form-select ${errores.transportista ? 'is-invalid' : ''}`} value={formulario.transportista} onChange={cambiarCampo}>
                        <option value="Starken">Starken</option>
                        <option value="Chilexpress">Chilexpress</option>
                      </select>
                      {errores.transportista && <div className="invalid-feedback">{errores.transportista}</div>}
                    </div>
                    <div className="mb-3">
                      <label htmlFor="direccion" className="form-label">Dirección *</label>
                      <input id="direccion" name="direccion" className={`form-control ${errores.direccion ? 'is-invalid' : ''}`} autoComplete="street-address" value={formulario.direccion} onChange={cambiarCampo} aria-invalid={Boolean(errores.direccion)} />
                      {errores.direccion && <div className="invalid-feedback">{errores.direccion}</div>}
                    </div>
                    <div className="mb-3">
                      <label htmlFor="comuna" className="form-label">Comuna *</label>
                      <input id="comuna" name="comuna" className={`form-control ${errores.comuna ? 'is-invalid' : ''}`} autoComplete="address-level2" value={formulario.comuna} onChange={cambiarCampo} aria-invalid={Boolean(errores.comuna)} />
                      {errores.comuna && <div className="invalid-feedback">{errores.comuna}</div>}
                    </div>
                    <div>
                      <label htmlFor="region" className="form-label">Región *</label>
                      <input id="region" name="region" className={`form-control ${errores.region ? 'is-invalid' : ''}`} autoComplete="address-level1" value={formulario.region} onChange={cambiarCampo} aria-invalid={Boolean(errores.region)} />
                      {errores.region && <div className="invalid-feedback">{errores.region}</div>}
                    </div>
                  </div>
                )}
                <button type="submit" className="btn btn-primary w-100">Confirmar pedido</button>
                <p className="small text-secondary mt-3 mb-0">Esta demostración registra los pedidos en el almacenamiento local de este navegador; no procesa pagos ni genera envíos reales.</p>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}

export default CarritoPage;
