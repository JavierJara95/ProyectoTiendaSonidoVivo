const classes = {
  entregado: "success",
  despachado: "info",
  "en preparación": "warning",
  cancelado: "neutral",
};
export default function StatusBadge({ status }) {
  return (
    <span className={`status-badge status-${classes[status] || "neutral"}`}>
      <span aria-hidden="true" />
      {status}
    </span>
  );
}
