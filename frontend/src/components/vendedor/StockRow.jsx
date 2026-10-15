function StockRow({ producto, onAumentar, onDisminuir }) {
  const stockBajo = producto.stock <= 2

  return (
    <tr>
      <td>{producto.nombre}</td>

      <td>{producto.categoria}</td>

      <td>
        <span
          className={
            stockBajo
              ? "badge bg-danger"
              : "badge bg-success"
          }
        >
          {producto.stock}
        </span>
      </td>

      <td>${producto.precio.toLocaleString("es-CL")}</td>

      <td>
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={() => onDisminuir(producto.id)}
            disabled={producto.stock === 0}
          >
            -
          </button>

          <button
            className="btn btn-outline-success btn-sm"
            onClick={() => onAumentar(producto.id)}
          >
            +
          </button>
        </div>
      </td>
    </tr>
  )
}

export default StockRow