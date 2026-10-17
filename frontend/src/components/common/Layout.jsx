import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ChartNoAxesCombined,
  ShoppingBag,
  Package,
  LogOut,
  ArrowUpRight,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Brand from "./Brand";
import Navbar from "./Navbar";
import Footer from "./Footer";
const adminLinks = [
  { to: "/admin", label: "Resumen general", Icon: LayoutDashboard, end: true },
  { to: "/admin/usuarios", label: "Usuarios", Icon: Users },
  {
    to: "/admin/reportes",
    label: "Reportes de ventas",
    Icon: ChartNoAxesCombined,
  },
];
export default function Layout() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);
  useEffect(() => {
    const close = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);
  const links =
    user.rol === "admin"
      ? adminLinks
      : user.rol === "vendedor"
        ? [{ to: "/vendedor/pedidos", label: "Pedidos", Icon: ShoppingBag }]
        : [{ to: "/cliente/catalogo", label: "Catálogo", Icon: Package }];
  return (
    <div className="app-shell">
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      {open && (
        <button
          className="sidebar-backdrop"
          aria-label="Cerrar menú"
          onClick={() => setOpen(false)}
        />
      )}
      <aside
        className={`sidebar ${open ? "is-open" : ""}`}
        aria-label="Navegación principal"
      >
        <div className="sidebar-brand">
          <Brand light />
          <button
            className="icon-button sidebar-close"
            onClick={() => setOpen(false)}
            aria-label="Cerrar menú"
          >
            <X size={20} />
          </button>
        </div>
        <div className="workspace-label">TU ESPACIO DE TRABAJO</div>
        <nav>
          {links.map(({ to, label, Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <Icon size={19} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-note">
          <AudioDecoration />
          <strong>Todo en sintonía.</strong>
          <p>Tu tienda, tus personas y tus ventas en un solo lugar.</p>
          <NavLink
            to={user.rol === "cliente" ? "/cliente/catalogo" : "/tienda"}
          >
            Ver espacio de tienda <ArrowUpRight size={15} />
          </NavLink>
        </div>
        <button className="logout-button" onClick={logout}>
          <LogOut size={18} />
          Cerrar sesión
        </button>
      </aside>
      <div className="main-shell">
        <Navbar onMenu={() => setOpen(true)} />
        <main id="contenido" className="page-content">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
function AudioDecoration() {
  return (
    <div className="wave-decoration" aria-hidden="true">
      {[14, 28, 40, 22, 48, 32, 18, 38, 25].map((height, i) => (
        <span style={{ height }} key={i} />
      ))}
    </div>
  );
}
