export default function PuntoRetiroCard({ punto }) {
  return (
    <article className="panel vendor-location-card">
      <p className="eyebrow">{punto.tipo}</p>
      <h3>{punto.nombre}</h3>
      <p><strong>Dirección:</strong> {punto.direccion}</p>
    </article>
  );
}
