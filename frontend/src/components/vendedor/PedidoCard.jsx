function PedidoCard({ pedido, onCambiarEstado, onGuardarSeguimiento }) {
  return (
    <div className="card shadow-sm mb-3">
      <div className="card-body">

        <h5 className="card-title">
          Pedido #{pedido.id}
        </h5>

        <p className="mb-1">
          <strong>Cliente:</strong> {pedido.cliente}
        </p>

        <p className="mb-1">
          <strong>Correo:</strong> {pedido.correo}
        </p>

        <p className="mb-1">
          <strong>Entrega:</strong> {pedido.tipoEntrega}
        </p>

        <p className="mb-1">
          <strong>Estado:</strong> {pedido.estado}
        </p>

        <p className="mb-3">
          <strong>Total:</strong> ${pedido.total.toLocaleString("es-CL")}
        </p>

        <div className="mb-3">
          <label className="form-label">
            Cambiar estado
          </label>

          <select
            className="form-select"
            value={pedido.estado}
            aria-label={`Estado pedido ${pedido.id}`}
            onChange={(e) =>
              onCambiarEstado(
                pedido.id,
                e.target.value
              )
            }
          >
            <option>En preparación</option>
            <option>Despachado</option>
            <option>Entregado</option>
          </select>
        </div>

        <div>
          <label className="form-label">
            Número de seguimiento
          </label>

          <input
            type="text"
            className="form-control"
            value={pedido.numeroSeguimiento}
            onChange={(e) =>
              onGuardarSeguimiento(pedido.id, e.target.value)
            }
            placeholder="Ej: CHX458921"
          />
        </div>

      </div>
    </div>
  )
}

export default PedidoCard