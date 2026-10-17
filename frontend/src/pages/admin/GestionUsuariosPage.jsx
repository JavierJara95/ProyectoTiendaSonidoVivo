import { useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  UserCheck,
  UserX,
  Users,
  ShieldCheck,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useStoredData } from "../../hooks/useStoredData";
import { KEYS, ROLE_LABELS } from "../../utils/constants";
import { listUsers, setUserActive } from "../../services/usuariosService";
import PageHeader from "../../components/ui/PageHeader";
import StatCard from "../../components/ui/StatCard";
import Alert from "../../components/ui/Alert";
import Modal from "../../components/ui/Modal";
import UserForm from "../../components/admin/UserForm";
export default function GestionUsuariosPage() {
  useStoredData(KEYS.users);
  const users = listUsers();
  const { user: current } = useAuth();
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [form, setForm] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const filtered = users.filter(
    (u) =>
      `${u.nombre} ${u.email}`.toLowerCase().includes(search.toLowerCase()) &&
      (!role || u.rol === role) &&
      (!status || String(u.activo) === status),
  );
  const pages = Math.max(1, Math.ceil(filtered.length / 8));
  const effectivePage = Math.min(page, pages);
  const visible = filtered.slice((effectivePage - 1) * 8, effectivePage * 8);
  async function changeStatus() {
    setBusy(true);
    setError("");
    try {
      await setUserActive(confirm.id, !confirm.activo);
      setNotice(confirm.activo ? "Usuario desactivado." : "Usuario activado.");
      setConfirm(null);
    } catch (e) {
      setError(e.message);
      setConfirm(null);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <PageHeader
        eyebrow="PERSONAS & PERMISOS"
        title="Un equipo en sintonía."
        description="Administra quién puede acceder y qué puede hacer en tu tienda."
      >
        <button
          className="btn btn-primary"
          onClick={() => {
            setForm({});
            setNotice("");
            setError("");
          }}
        >
          <Plus size={18} />
          Crear usuario
        </button>
      </PageHeader>
      <div className="stats-grid stats-three">
        <StatCard
          title="Usuarios registrados"
          value={users.length}
          detail={`${users.filter((u) => u.activo).length} cuentas activas`}
          Icon={Users}
        />
        <StatCard
          title="Administradores"
          value={users.filter((u) => u.rol === "admin").length}
          detail="Gestión y control del sistema"
          Icon={ShieldCheck}
        />
        <StatCard
          title="Vendedores"
          value={users.filter((u) => u.rol === "vendedor").length}
          detail="Atención, pedidos e inventario"
          Icon={ShoppingBag}
        />
      </div>
      <Alert kind="success">{notice}</Alert>
      <Alert>{error}</Alert>
      <section className="panel">
        <div className="panel-heading">
          <div>
            <h2>Usuarios del sistema</h2>
            <p>Encuentra y actualiza las cuentas de tu tienda.</p>
          </div>
          <span className="count-chip">{filtered.length} usuarios</span>
        </div>
        <div className="filter-bar">
          <div className="search-field">
            <Search size={18} aria-hidden="true" />
            <input
              aria-label="Buscar usuarios"
              placeholder="Buscar por nombre o correo…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <select
            className="form-select"
            aria-label="Filtrar por rol"
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Todos los roles</option>
            {Object.entries(ROLE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <select
            className="form-select"
            aria-label="Filtrar por estado"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Todos los estados</option>
            <option value="true">Activos</option>
            <option value="false">Inactivos</option>
          </select>
        </div>
        <div className="table-responsive">
          <table className="table sv-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Rol</th>
                <th>Estado</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div className="user-cell">
                      <span className={`avatar avatar-${u.rol}`}>
                        {u.nombre.slice(0, 1)}
                      </span>
                      <div>
                        <strong>
                          {u.nombre}
                          {u.id === current.id && (
                            <small className="you-label"> Tú</small>
                          )}
                        </strong>
                        <small>{u.email}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`role-badge role-${u.rol}`}>
                      {ROLE_LABELS[u.rol]}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`status-badge status-${u.activo ? "success" : "neutral"}`}
                    >
                      <span aria-hidden="true" />
                      {u.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td>
                    <div className="row-actions">
                      <button
                        className="icon-button"
                        aria-label={`Editar ${u.nombre}`}
                        title="Editar usuario"
                        onClick={() => setForm({ user: u })}
                      >
                        <Pencil size={17} />
                      </button>
                      <button
                        className="icon-button"
                        disabled={u.id === current.id}
                        aria-label={`${u.activo ? "Desactivar" : "Activar"} ${u.nombre}`}
                        title={
                          u.id === current.id
                            ? "Tu propia cuenta debe permanecer activa"
                            : u.activo
                              ? "Desactivar usuario"
                              : "Activar usuario"
                        }
                        onClick={() => setConfirm(u)}
                      >
                        {u.activo ? (
                          <UserX size={18} />
                        ) : (
                          <UserCheck size={18} />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!visible.length && (
                <tr>
                  <td colSpan={4} className="empty-state">
                    No hay usuarios que coincidan con los filtros.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="table-footer">
          <span>
            {filtered.length
              ? `${(effectivePage - 1) * 8 + 1}–${Math.min(effectivePage * 8, filtered.length)}`
              : "0"}{" "}
            de {filtered.length} usuarios
          </span>
          <div className="pagination-buttons">
            <button
              className="icon-button"
              disabled={effectivePage === 1}
              aria-label="Página anterior"
              onClick={() => setPage(effectivePage - 1)}
            >
              <ChevronLeft size={18} />
            </button>
            <span>
              {effectivePage} / {pages}
            </span>
            <button
              className="icon-button"
              disabled={effectivePage === pages}
              aria-label="Página siguiente"
              onClick={() => setPage(effectivePage + 1)}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </section>
      {form && (
        <UserForm
          user={form.user}
          onClose={() => setForm(null)}
          onSaved={(message) => {
            setForm(null);
            setNotice(message);
            setError("");
          }}
        />
      )}
      {confirm && (
        <Modal
          title={confirm.activo ? "Desactivar usuario" : "Activar usuario"}
          onClose={() => setConfirm(null)}
          busy={busy}
        >
          <p>
            ¿Quieres {confirm.activo ? "desactivar" : "activar"} la cuenta de{" "}
            <strong>{confirm.nombre}</strong>?
          </p>
          <p className="muted small">
            {confirm.activo
              ? "La cuenta quedará registrada, pero no podrá iniciar sesión."
              : "La cuenta podrá iniciar sesión nuevamente."}
          </p>
          <div className="dialog-actions">
            <button
              className="btn btn-outline-secondary"
              disabled={busy}
              onClick={() => setConfirm(null)}
            >
              Cancelar
            </button>
            <button
              className="btn btn-primary"
              disabled={busy}
              onClick={changeStatus}
            >
              {busy ? "Actualizando…" : "Confirmar"}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
