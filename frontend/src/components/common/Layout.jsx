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
  MapPin,
  ShoppingCart,
  Search,
  Boxes,
} from "../ui/Icons";
import { useAuth } from "../../context/AuthContext";
import Brand from "./Brand";
import Navbar from "./Navbar";
import Footer from "./Footer";

const adminLinks = [
  { to: "/admin", label: "Resumen general", Icon: LayoutDashboard, end: true },
  { to: "/admin/usuarios", label: "Usuarios", Icon: Users },
  { to: "/admin/reportes", label: "Reportes de ventas", Icon: ChartNoAxesCombined },
  { to: "/vendedor/pedidos", label: "Pedidos", Icon: ShoppingBag },
  { to: "/vendedor/stock", label: "Stock", Icon: Boxes },
  { to: "/vendedor/ubicacion", label: "Ubicación", Icon: MapPin },
  { to: "/cliente/catalogo", label: "Catálogo", Icon: Package },
];

const vendedorLinks = [
  { to: "/vendedor/pedidos", label: "Pedidos", Icon: ShoppingBag },
  { to: "/vendedor/stock", label: "Stock", Icon: Boxes },
  { to: "/vendedor/ubicacion", label: "Ubicación", Icon: MapPin },
];

const clienteLinks = [
  { to: "/cliente/catalogo", label: "Catálogo", Icon: Package },
  { to: "/cliente/carrito", label: "Carrito", Icon: ShoppingCart },
  { to: "/cliente/seguimiento", label: "Seguimiento", Icon: Search },
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
        ? vendedorLinks
        : clienteLinks;

  const espacioPrincipal =
    user.rol === "admin"
      ? "/admin"
      : user.rol === "vendedor"
        ? "/vendedor/pedidos"
        : "/cliente/catalogo";

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
          <p>Catálogo, operaciones y administración en una sola experiencia.</p>
          <NavLink to={espacioPrincipal}>
            Ir al inicio de mi espacio <ArrowUpRight size={15} />
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
