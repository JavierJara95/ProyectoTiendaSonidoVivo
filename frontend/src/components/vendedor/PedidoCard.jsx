import { useState, useEffect } from "react";
import StatusBadge from "../ui/StatusBadge";

export default function PedidoCard({ pedido, onCambiarEstado, onGuardarSeguimiento }) {
  const [tracking, setTracking] = useState(pedido.numeroSeguimiento || '');
  useEffect(() => setTracking(pedido.numeroSeguimiento || ''), [pedido.numeroSeguimiento]);
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
            onChange={(e) => onCambiarEstado(pedido.id, e.target.value, tracking)}
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
            value={tracking}
            onChange={(e) => setTracking(e.target.value)}
            placeholder="Ej: CHX458921"
          />
          {pedido.estado === 'Despachado' && <button type="button" className="btn btn-outline-primary btn-sm mt-2" onClick={() => onGuardarSeguimiento(pedido.id, tracking)}>Guardar seguimiento</button>}
          {pedido.estado === 'En preparación' && pedido.entrega?.modalidad !== 'RETIRO_TIENDA' && <small className="text-secondary d-block">Para despachar, ingresa el seguimiento antes de cambiar el estado.</small>}
        </div>
      </div>
    </article>
  );
}
