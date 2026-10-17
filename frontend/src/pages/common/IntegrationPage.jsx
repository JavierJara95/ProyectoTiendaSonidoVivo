import { Link } from "react-router-dom";
import { Puzzle, ArrowLeft } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { homeByRole } from "../../utils/constants";
export default function IntegrationPage({ owner, module }) {
  const { user } = useAuth();
  return (
    <section className="integration-card">
      <span className="integration-icon">
        <Puzzle size={32} />
      </span>
      <p className="eyebrow">ESPACIO DE INTEGRACIÓN</p>
      <h1>{module}</h1>
      <p>
        Este módulo corresponde a <strong>{owner}</strong>. La navegación y los
        permisos ya están preparados para incorporar sus componentes.
      </p>
      <p className="muted">
        La entrega de Esteban incluye administración, usuarios, autenticación y
        reportes.
      </p>
      <Link
        className="btn btn-outline-secondary"
        to={user.rol === "admin" ? homeByRole.admin : "/cuenta"}
      >
        <ArrowLeft size={16} />
        {user.rol === "admin" ? "Volver al resumen" : "Ver mi cuenta"}
      </Link>
    </section>
  );
}
