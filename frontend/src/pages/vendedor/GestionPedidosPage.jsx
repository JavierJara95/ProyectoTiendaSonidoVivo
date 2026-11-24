import { useEffect, useState } from "react";
import { ShoppingBag, PackageCheck, Truck, Clock3 } from "../../components/ui/Icons";
import { allOrders, normalizeOrder, changeOrderState } from "../../services/pedidosService";
import PedidoCard from "../../components/vendedor/PedidoCard";
import PageHeader from "../../components/ui/PageHeader";
import StatCard from "../../components/ui/StatCard";


export default function GestionPedidosPage() {
  const [pedidos, setPedidos] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [error, setError] = useState('');
  const cargar = async () => {
    try { setPedidos((await allOrders()).map(normalizeOrder)); setError(''); }
    catch (e) { setError(e.message); }
  };
  useEffect(() => { cargar(); }, []);
  const actualizarPedido = async (id, estado, tracking) => {
    try {
      await changeOrderState(id, estado, tracking);
      await cargar();
    } catch (e) { setError(e.message); }
  };
  const cambiarEstado = (id, nuevoEstado, tracking) => {
    const pedido = pedidos.find(p => p.id === id);
    const estados = { 'En preparación': 'EN_PREPARACION', 'Despachado': 'DESPACHADO', 'Entregado': 'ENTREGADO' };
    actualizarPedido(id, estados[nuevoEstado], tracking || pedido?.numeroSeguimiento || null);
  };
  const guardarSeguimiento = (id, numeroSeguimiento) => {
    const pedido = pedidos.find(p => p.id === id);
    const estados = { 'En preparación': 'EN_PREPARACION', 'Despachado': 'DESPACHADO', 'Entregado': 'ENTREGADO' };
    actualizarPedido(id, estados[pedido?.estado], numeroSeguimiento);
  };

  const totalPedidos = pedidos.length;
  const pedidosPreparacion = pedidos.filter(
    (pedido) => pedido.estado === "En preparación",
  ).length;
  const pedidosDespachados = pedidos.filter(
    (pedido) => pedido.estado === "Despachado",
  ).length;
  const pedidosEntregados = pedidos.filter(
    (pedido) => pedido.estado === "Entregado",
  ).length;

  const pedidosFiltrados =
    filtroEstado === "Todos"
      ? pedidos
      : pedidos.filter((pedido) => pedido.estado === filtroEstado);

  return (
    <section className="module-page">
      <PageHeader
        eyebrow="OPERACIONES"
        title="Gestión de Pedidos"
        description="Revisa pedidos remotos, actualiza su estado y registra números de seguimiento."
      />

      {error && <div role="alert" className="alert alert-danger">{error}</div>}
      <div className="stats-grid vendor-stats">
        <StatCard title="Total" value={totalPedidos} detail="Pedidos registrados" Icon={ShoppingBag} />
        <StatCard title="En preparación" value={pedidosPreparacion} detail="Pendientes de despacho" Icon={Clock3} accent />
        <StatCard title="Despachados" value={pedidosDespachados} detail="En camino al cliente" Icon={Truck} />
        <StatCard title="Entregados" value={pedidosEntregados} detail="Proceso completado" Icon={PackageCheck} />
      </div>

      <div className="panel vendor-filter-panel">
        <div>
          <label htmlFor="filtroEstado" className="form-label">
            Filtrar por estado
          </label>
          <select
            id="filtroEstado"
            className="form-select"
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
          >
            <option value="Todos">Todos</option>
            <option value="En preparación">En preparación</option>
            <option value="Despachado">Despachado</option>
            <option value="Entregado">Entregado</option>
          </select>
        </div>
        <span className="vendor-result-count">
          {pedidosFiltrados.length} pedido{pedidosFiltrados.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="vendor-card-grid">
        {pedidosFiltrados.map((pedido) => (
          <PedidoCard
            key={pedido.id}
            pedido={pedido}
            onCambiarEstado={cambiarEstado}
            onGuardarSeguimiento={guardarSeguimiento}
          />
        ))}
      </div>

      {pedidosFiltrados.length === 0 && (
        <div className="alert alert-info">No existen pedidos para este estado.</div>
      )}
    </section>
  );
}
