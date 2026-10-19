import { DashboardAdminPage, GestionUsuariosPage, ReportesVentasPage } from "./adminModules.jsx";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { homeByRole } from "../utils/constants";
import ProtectedRoute from "./ProtectedRoute";
import Layout from "../components/common/Layout";
import LoginPage from "../pages/auth/LoginPage";
import RegistroPage from "../pages/auth/RegistroPage";
import AccountPage from "../pages/common/AccountPage";
import AccessDeniedPage from "../pages/common/AccessDeniedPage";
import NotFoundPage from "../pages/common/NotFoundPage";
import ClienteModule from "../pages/cliente/ClienteModule";
import GestionPedidosPage from "../pages/vendedor/GestionPedidosPage";
import ControlStockPage from "../pages/vendedor/ControlStockPage";
import UbicacionTiendaPage from "../pages/vendedor/UbicacionTIendaPage";

function PublicOnly() {
  const { ready, user, error } = useAuth();
  if (!ready)
    return (
      <div className="loading-screen" role="status">
        Preparando Sonido Vivo…
      </div>
    );
  if (error)
    return (
      <div className="container py-5" role="alert">
        {error}
      </div>
    );
  return user ? <Navigate to={homeByRole[user.rol]} replace /> : <Outlet />;
}

function RoleHome() {
  const { user } = useAuth();
  return <Navigate to={homeByRole[user.rol]} replace />;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicOnly />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegistroPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route index element={<RoleHome />} />
          <Route path="cuenta" element={<AccountPage />} />
          <Route path="sin-acceso" element={<AccessDeniedPage />} />

          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="admin" element={<DashboardAdminPage />} />
            <Route path="admin/usuarios" element={<GestionUsuariosPage />} />
            <Route path="admin/reportes" element={<ReportesVentasPage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["admin", "vendedor"]} />}>
            <Route path="vendedor" element={<Navigate to="/vendedor/pedidos" replace />} />
            <Route path="vendedor/pedidos" element={<GestionPedidosPage />} />
            <Route path="vendedor/stock" element={<ControlStockPage />} />
            <Route path="vendedor/ubicacion" element={<UbicacionTiendaPage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["admin", "cliente"]} />}>
            <Route path="cliente/*" element={<ClienteModule />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
