import { Menu, Bell } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { ROLE_LABELS } from "../../utils/constants";
export default function Navbar({ onMenu }) {
  const { user } = useAuth();
  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          className="icon-button mobile-menu"
          onClick={onMenu}
          aria-label="Abrir menú"
        >
          <Menu size={22} />
        </button>
        <span className="breadcrumb-label">
          Sonido Vivo <span>/</span> {ROLE_LABELS[user.rol]}
        </span>
      </div>
      <div className="topbar-account">
        <span className="location-chip">Viña del Mar</span>
        <Bell size={18} aria-hidden="true" />
        <span className="avatar">{user.nombre.slice(0, 1)}</span>
        <div className="account-name">
          <strong>{user.nombre}</strong>
          <small>{ROLE_LABELS[user.rol]}</small>
        </div>
      </div>
    </header>
  );
}
