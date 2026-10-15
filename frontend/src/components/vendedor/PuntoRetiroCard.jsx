function PuntoRetiroCard({ punto }) {
  return (
    <div className="card shadow-sm mb-3">
      <div className="card-body">

        <h5 className="card-title">
          {punto.nombre}
        </h5>

        <p className="mb-1">
          <strong>Tipo:</strong> {punto.tipo}
        </p>

        <p className="mb-0">
          <strong>Dirección:</strong> {punto.direccion}
        </p>

      </div>
    </div>
  )
}

export default PuntoRetiroCard