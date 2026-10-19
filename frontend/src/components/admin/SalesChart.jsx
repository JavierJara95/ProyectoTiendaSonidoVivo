import { money, dateLabel } from "../../utils/format";
export default function SalesChart({ data }) {
  if (!data.length)
    return (
      <div className="chart-empty">
        Todavía no hay ventas aprobadas en este período.
      </div>
    );
  const max = Math.max(...data.map((item) => item.total), 1);
  return (
    <div
      className="sales-chart"
      role="img"
      aria-label={`Ventas por fecha: ${data.map((item) => `${dateLabel(item.fecha)}: ${money(item.total)}`).join("; ")}`}
    >
      <div className="chart-scale">
        <span>{money(max)}</span>
        <span>{money(max / 2)}</span>
        <span>$0</span>
      </div>
      <div className="chart-plot">
        <div className="chart-grid" />
        <div className="chart-bars">
          {data.map((item) => (
            <div className="chart-bar-column" key={item.fecha}>
              <div
                className="chart-bar"
                style={{ height: `${Math.max(2, (item.total / max) * 100)}%` }}
                title={`${dateLabel(item.fecha)}: ${money(item.total)}`}
              />
              <small>{item.fecha.slice(8, 10)}</small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
