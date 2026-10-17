import { BrowserRouter, Link, Routes, Route } from "react-router-dom";
import Layout from "../components/common/Layout.jsx";
export default function AppRouter() {
  return <BrowserRouter><Layout><Routes>
    <Route path="/" element={<section className="card shadow-sm"><div className="card-body p-4"><h1>Bienvenido a Sonido Vivo</h1><p>Tienda de instrumentos y equipos musicales.</p></div></section>} />
    <Route path="*" element={<section><h1>Página no encontrada</h1><Link to="/">Volver al inicio</Link></section>} />
  </Routes></Layout></BrowserRouter>;
}
