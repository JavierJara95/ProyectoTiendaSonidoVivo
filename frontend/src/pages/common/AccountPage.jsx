import { useAuth } from "../../context/AuthContext";
import { ROLE_LABELS } from "../../utils/constants";
import PageHeader from "../../components/ui/PageHeader";
export default function AccountPage() {
  const { user } = useAuth();
  return (
    <>
      <PageHeader
        eyebrow="MI CUENTA"
        title={user.nombre}
        description="Tu acceso a Sonido Vivo."
      />
      <section className="panel p-4">
        <p>
          <strong>Correo:</strong> {user.email}
        </p>
        <p>
          <strong>Rol:</strong> {ROLE_LABELS[user.rol]}
        </p>
        <p className="mb-0">
          <strong>Estado:</strong> Activo
        </p>
      </section>
    </>
  );
}
