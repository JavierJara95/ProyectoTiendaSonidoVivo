import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ArrowRight,
  CircleDollarSign,
  ShoppingBag,
  Package,
  Users,
  AlertTriangle,
} from "../../components/ui/Icons";
import { useAuth } from "../../context/AuthContext";
import { useStoredData } from "../../hooks/useStoredData";
import { KEYS } from "../../utils/constants";
import { money, number, localDate, dateLabel } from "../../utils/format";
import { getReport } from "../../services/reportesService";
import { listUsers } from "../../services/usuariosService";
import PageHeader from "../../components/ui/PageHeader";
import StatCard from "../../components/ui/StatCard";
import StatusBadge from "../../components/ui/StatusBadge";
import SalesChart from "../../components/admin/SalesChart";
export default function DashboardAdminPage() {
  useStoredData(KEYS.orders);
  useStoredData(KEYS.products);
  useStoredData(KEYS.users);
  const { user } = useAuth();
  const now = new Date();
  const first = new Date(now.getFullYear(), now.getMonth(), 1);
  const report = getReport({ desde: localDate(first), hasta: localDate(now) });
  const users = listUsers();
  const recent = [...report.orders]
    .sort((a, b) => b.fecha.localeCompare(a.fecha))
    .slice(0, 5);
  return (
    <>
      <PageHeader
        eyebrow="TU TIENDA, EN UN VISTAZO"
        title={`Hola, ${user.nombre.split(" ")[0]}.`}
        description="Así está sonando tu negocio este mes."
      >
        <span className="date-chip">
          {now.toLocaleDateString("es-CL", { month: "long", year: "numeric" })}
        </span>
      </PageHeader>
      <section className="welcome-banner">
        <div>
          <span className="banner-eyebrow">
            CADA VENTA TIENE SU PROPIA HISTORIA
          </span>
          <h2>Que nada interrumpa el ritmo.</h2>
          <p>Revisa tus resultados y mantén a todo el equipo en sintonía.</p>
          <Link to="/admin/reportes">
            Explorar reportes <ArrowUpRight size={17} />
          </Link>
        </div>
        <div className="banner-art" aria-hidden="true">
          <div className="record">
            <div />
          </div>
          <div className="record-label">
            SONIDO
            <br />
            VIVO
          </div>
        </div>
      </section>
      <div className="stats-grid">
        <StatCard
          title="Ventas del mes"
          value={money(report.revenue)}
          detail="Pagos aprobados · sin cancelados"
          Icon={CircleDollarSign}
          accent
        />
        <StatCard
          title="Pedidos del mes"
          value={report.orders.length}
          detail={`${report.saleCount} con venta aprobada`}
          Icon={ShoppingBag}
        />
        <StatCard
          title="Unidades disponibles"
          value={number(report.stockUnits)}
          detail={`${report.productCount} referencias en el catálogo`}
          Icon={Package}
        />
        <StatCard
          title="Usuarios activos"
          value={users.filter((u) => u.activo).length}
          detail={`${users.length} cuentas registradas`}
          Icon={Users}
        />
      </div>
      <div className="dashboard-grid">
        <section className="panel">
          <div className="panel-heading">
            <div>
              <h2>El pulso de tus ventas</h2>
              <p>Ingresos aprobados por día del mes.</p>
            </div>
            <span className="legend">
              <i />
              Ventas
            </span>
          </div>
          <SalesChart data={report.byDay} />
          <div className="chart-summary">
            <span>
              Ticket promedio <strong>{money(report.averageTicket)}</strong>
            </span>
            <Link to="/admin/reportes">
              Ver detalle <ArrowRight size={15} />
            </Link>
          </div>
        </section>
        <section className="panel stock-panel">
          <div className="panel-heading">
            <div>
              <h2>Atención al stock</h2>
              <p>Productos con 3 unidades o menos.</p>
            </div>
            <AlertTriangle size={19} />
          </div>
          <div className="stock-list">
            {report.lowStock.slice(0, 5).map((p) => (
              <div className="stock-row" key={p.codigo}>
                <span className="product-code">{p.codigo}</span>
                <div>
                  <strong>{p.nombre}</strong>
                  <small>{p.marca}</small>
                </div>
                <span
                  className={`stock-count ${p.stock === 0 ? "stock-zero" : ""}`}
                >
                  {p.stock} ud.
                </span>
              </div>
            ))}
            {!report.lowStock.length && (
              <p className="muted">
                Todos los productos tienen más de 3 unidades.
              </p>
            )}
          </div>
          <div className="stock-foot">
            {report.lowStock.length} referencias requieren revisión
          </div>
        </section>
      </div>
      <section className="panel recent-panel">
        <div className="panel-heading">
          <div>
            <h2>Pedidos recientes</h2>
            <p>La actividad más reciente de este mes.</p>
          </div>
          <span className="demo-data-chip">
            Datos de demostración iniciales
          </span>
        </div>
        <div className="table-responsive">
          <table className="table sv-table">
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Entrega</th>
                <th>Estado</th>
                <th className="text-end">Total</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((order) => (
                <tr key={order.id}>
                  <td className="order-id">{order.id}</td>
                  <td>{order.clienteNombre}</td>
                  <td>{dateLabel(order.fecha)}</td>
                  <td>
                    {order.tipoEntrega === "retiro"
                      ? "Retiro en tienda"
                      : "Despacho"}
                  </td>
                  <td>
                    <StatusBadge status={order.estado} />
                  </td>
                  <td className="text-end fw-semibold">{money(order.total)}</td>
                </tr>
              ))}
              {!recent.length && (
                <tr>
                  <td colSpan={6} className="empty-state">
                    No hay pedidos este mes.
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
