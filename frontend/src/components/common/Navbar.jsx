import { Link } from "react-router-dom";
export default function Navbar() {
  return <header className="bg-dark"><nav className="navbar navbar-dark" aria-label="Navegación principal"><div className="container"><Link className="navbar-brand fw-bold" to="/">Sonido Vivo</Link><span className="navbar-text">Instrumentos y equipos musicales</span></div></nav></header>;
}
