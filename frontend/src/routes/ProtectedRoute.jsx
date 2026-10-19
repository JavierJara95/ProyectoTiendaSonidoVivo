import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function ProtectedRoute({ allowedRoles }) {
  const { user, ready, error } = useAuth();
  const location = useLocation();
  if (!ready)
    return (
      <div className="loading-screen" role="status">
        Preparando Sonido Vivo…
      </div>
    );
  if (error)
    return (
      <div className="container py-5">
        <p role="alert">{error}</p>
      </div>
    );
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (allowedRoles && !allowedRoles.includes(user.rol))
    return <Navigate to="/sin-acceso" replace />;
  return <Outlet />;
}
