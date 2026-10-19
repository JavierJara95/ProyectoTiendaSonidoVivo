import { useState } from "react";
import {
  Download,
  CircleDollarSign,
  ShoppingBag,
  Package,
  ReceiptText,
} from "../../components/ui/Icons";
import { useStoredData } from "../../hooks/useStoredData";
import { KEYS } from "../../utils/constants";
import { getReport } from "../../services/reportesService";
import { downloadCsv } from "../../utils/csv";
import { money, localDate, dateLabel } from "../../utils/format";
import PageHeader from "../../components/ui/PageHeader";
import StatCard from "../../components/ui/StatCard";
import StatusBadge from "../../components/ui/StatusBadge";
import SalesChart from "../../components/admin/SalesChart";
function monthFilters() {
  const now = new Date();
  return {
    desde: localDate(new Date(now.getFullYear(), now.getMonth(), 1)),
    hasta: localDate(now),
  };
}
export default function ReportesVentasPage() {
  useStoredData(KEYS.orders);
  useStoredData(KEYS.products);
  const [filters, setFilters] = useState(monthFilters);
  const [draft, setDraft] = useState(monthFilters);
  const [error, setError] = useState("");
  const report = getReport(filters);
  const maxCategory = Math.max(
    ...report.byCategory.map((item) => item.total),
    1,
  );
  function apply(event) {
    event.preventDefault();
    if (!draft.desde || !draft.hasta) {
      setError("Selecciona ambas fechas.");
      return;
    }
    if (draft.desde > draft.hasta) {
      setError("La fecha inicial no puede ser posterior a la final.");
      return;
    }
    setError("");
    setFilters(draft);
  }
  function preset(type) {
    let next = monthFilters();
    if (type === "30") {
      const date = new Date();
      date.setDate(date.getDate() - 29);
      next = { desde: localDate(date), hasta: localDate() };
    }
    setDraft(next);
    setFilters(next);
    setError("");
  }
  return (
    <>
      <PageHeader
        eyebrow="RESULTADOS QUE IMPORTAN"
        title="Escucha tus números."
        description="Conoce qué se vende y cómo evoluciona tu tienda."
      >
        <button
          className="btn btn-outline-secondary"
          onClick={() => downloadCsv(report.sales)}
          disabled={!report.saleCount}
        >
          <Download size={17} />
          Exportar CSV
        </button>
      </PageHeader>
      <section className="report-filters">
        <form onSubmit={apply}>
          <div>
            <label htmlFor="desde" className="form-label">
              Desde
            </label>
            <input
              className="form-control"
              id="desde"
              type="date"
              value={draft.desde}
              onChange={(e) => setDraft({ ...draft, desde: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="hasta" className="form-label">
              Hasta
            </label>
            <input
              className="form-control"
              id="hasta"
              type="date"
              value={draft.hasta}
              onChange={(e) => setDraft({ ...draft, hasta: e.target.value })}
            />
          </div>
          <button className="btn btn-primary" type="submit">
            Aplicar período
          </button>
          <div className="preset-buttons">
            <button
              className="btn btn-light"
              type="button"
              onClick={() => preset("mes")}
            >
              Este mes
            </button>
            <button
              className="btn btn-light"
              type="button"
              onClick={() => preset("30")}
            >
              Últimos 30 días
            </button>
          </div>
        </form>
        {error && (
          <p className="text-danger mb-0 mt-2" role="alert">
            {error}
          </p>
        )}
      </section>
      <p className="report-period">
        Mostrando del <strong>{dateLabel(filters.desde)}</strong> al{" "}
        <strong>{dateLabel(filters.hasta)}</strong> · Solo pagos aprobados y
        pedidos sin cancelar.
      </p>
      <div className="stats-grid">
        <StatCard
          title="Ingresos del período"
          value={money(report.revenue)}
          detail="Valor de ventas aprobadas"
          Icon={CircleDollarSign}
          accent
        />
        <StatCard
          title="Ventas aprobadas"
          value={report.saleCount}
          detail={`${report.orders.length} pedidos en total`}
          Icon={ShoppingBag}
        />
        <StatCard
          title="Unidades vendidas"
          value={report.units}
          detail="Sumatoria de productos vendidos"
          Icon={Package}
        />
        <StatCard
          title="Ticket promedio"
          value={money(report.averageTicket)}
          detail="Ingresos / ventas aprobadas"
          Icon={ReceiptText}
        />
      </div>
      <div className="dashboard-grid">
        <section className="panel">
          <div className="panel-heading">
            <div>
              <h2>Evolución de ventas</h2>
              <p>Ingresos por fecha dentro del período.</p>
            </div>
            <span className="legend">
              <i />
              Ventas
            </span>
          </div>
          <SalesChart data={report.byDay} />
        </section>
        <section className="panel">
          <div className="panel-heading">
            <div>
              <h2>Ventas por categoría</h2>
              <p>Las familias de productos con más ingresos.</p>
            </div>
          </div>
          <div className="category-list">
            {report.byCategory.map((item) => (
              <div className="category-row" key={item.categoria}>
                <div>
                  <span>{item.categoria}</span>
                  <strong>{money(item.total)}</strong>
                </div>
                <div className="category-track">
                  <span
                    style={{ width: `${(item.total / maxCategory) * 100}%` }}
                  />
                </div>
                <small>{item.unidades} unidades vendidas</small>
              </div>
            ))}
            {!report.byCategory.length && (
              <p className="muted">No hay ventas en este período.</p>
            )}
          </div>
        </section>
      </div>
      <section className="panel">
        <div className="panel-heading">
          <div>
            <h2>Detalle de ventas aprobadas</h2>
            <p>Estas ventas se incluyen en el resumen y la exportación.</p>
          </div>
          <span className="count-chip">{report.saleCount} ventas</span>
        </div>
        <div className="table-responsive">
          <table className="table sv-table">
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Estado</th>
                <th className="text-end">Total</th>
              </tr>
            </thead>
            <tbody>
              {[...report.sales]
                .sort((a, b) => b.fecha.localeCompare(a.fecha))
                .map((order) => (
                  <tr key={order.id}>
                    <td className="order-id">{order.id}</td>
                    <td>{dateLabel(order.fecha)}</td>
                    <td>{order.clienteNombre}</td>
                    <td>
                      <StatusBadge status={order.estado} />
                    </td>
                    <td className="text-end fw-semibold">
                      {money(order.total)}
                    </td>
                  </tr>
                ))}
              {!report.saleCount && (
                <tr>
                  <td colSpan={5} className="empty-state">
                    No se encontraron ventas aprobadas en el período.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
