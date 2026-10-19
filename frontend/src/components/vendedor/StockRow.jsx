export default function StockRow({ producto, onAumentar, onDisminuir }) {
  const claseStock = producto.stock === 0
    ? "stock-count stock-zero"
    : producto.stock <= 2
      ? "stock-count"
      : "stock-count vendor-stock-ok";

  return (
    <tr>
      <td><strong>{producto.nombre}</strong></td>
      <td>{producto.categoria}</td>
      <td><span className={claseStock}>{producto.stock}</span></td>
      <td>${producto.precio.toLocaleString("es-CL")}</td>
      <td>
        <div className="vendor-stock-actions">
          <button className="btn btn-outline-secondary btn-sm" aria-label={`Disminuir stock de ${producto.nombre}`} onClick={() => onDisminuir(producto.id)} disabled={producto.stock === 0}>-</button>
          <button className="btn btn-primary btn-sm" aria-label={`Aumentar stock de ${producto.nombre}`} onClick={() => onAumentar(producto.id)}>+</button>
        </div>
      </td>
    </tr>
  );
}
