import StatusBadge from "../ui/StatusBadge";

export default function PedidoCard({ pedido, onCambiarEstado, onGuardarSeguimiento }) {
  const estadoNormalizado = String(pedido.estado || "").toLowerCase();
  return (
    <article className="panel vendor-order-card">
      <div className="vendor-order-head">
        <div>
          <p className="eyebrow">PEDIDO</p>
          <h2>Pedido #{pedido.id}</h2>
        </div>
        <StatusBadge status={estadoNormalizado} />
      </div>

      <dl className="vendor-order-details">
        <div><dt>Cliente</dt><dd>{pedido.cliente}</dd></div>
        <div><dt>Correo</dt><dd>{pedido.correo || "Sin correo"}</dd></div>
        <div><dt>Entrega</dt><dd>{pedido.tipoEntrega || "Por definir"}</dd></div>
        <div><dt>Total</dt><dd>${Number(pedido.total || 0).toLocaleString("es-CL")}</dd></div>
      </dl>

      <div className="vendor-order-form">
        <div>
          <label className="form-label" htmlFor={`estado-${pedido.id}`}>Cambiar estado</label>
          <select
            id={`estado-${pedido.id}`}
            className="form-select"
            value={pedido.estado}
            aria-label={`Estado pedido ${pedido.id}`}
            onChange={(e) => onCambiarEstado(pedido.id, e.target.value)}
          >
            <option>En preparación</option>
            <option>Despachado</option>
            <option>Entregado</option>
          </select>
        </div>
        <div>
          <label className="form-label" htmlFor={`seguimiento-${pedido.id}`}>Número de seguimiento</label>
          <input
            id={`seguimiento-${pedido.id}`}
            type="text"
            className="form-control"
            value={pedido.numeroSeguimiento || ""}
            onChange={(e) => onGuardarSeguimiento(pedido.id, e.target.value)}
            placeholder="Ej: CHX458921"
          />
        </div>
      </div>
    </article>
  );
}
