import { Link } from "react-router-dom";
import { ShieldX } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { homeByRole } from "../../utils/constants";
export default function AccessDeniedPage() {
  const { user } = useAuth();
  return (
    <section className="integration-card">
      <ShieldX size={40} />
      <h1 className="mt-3">No tienes acceso a esta sección.</h1>
      <p>Tu cuenta no tiene los permisos necesarios.</p>
      <Link className="btn btn-primary" to={homeByRole[user.rol]}>
        Volver a mi espacio
      </Link>
    </section>
  );
}
