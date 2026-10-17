import { Link } from "react-router-dom";
function Pending({ title }) { return <section className="panel p-4"><h1>{title}</h1><p>El acceso por rol está preparado. Esta vista se incorpora en el siguiente bloque de Esteban.</p><Link to="/cuenta">Ver mi cuenta</Link></section>; }
export function DashboardAdminPage() { return <Pending title="Administración de Sonido Vivo" />; }
export function GestionUsuariosPage() { return <Pending title="Gestión de usuarios" />; }
export function ReportesVentasPage() { return <Pending title="Reportes de ventas" />; }
