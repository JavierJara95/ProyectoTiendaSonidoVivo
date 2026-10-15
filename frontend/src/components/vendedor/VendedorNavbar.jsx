import { NavLink } from "react-router-dom"

function VendedorNavbar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">

                <NavLink
                    className="navbar-brand"
                    to="/vendedor/pedidos"
                >
                    Sonido Vivo
                </NavLink>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarVendedor"
                    aria-controls="navbarVendedor"
                    aria-expanded="false"
                    aria-label="Abrir navegación"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div
                    className="collapse navbar-collapse"
                    id="navbarVendedor"
                >
                    <ul className="navbar-nav ms-auto">

                        <li className="nav-item">
                            <NavLink
                                className={({ isActive }) =>
                                    isActive
                                        ? "nav-link active fw-bold"
                                        : "nav-link"
                                }
                                to="/vendedor/pedidos"
                            >
                                Pedidos
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink
                                className={({ isActive }) =>
                                    isActive
                                        ? "nav-link active fw-bold"
                                        : "nav-link"
                                }
                                to="/vendedor/stock"
                            >
                                Stock
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink
                                className={({ isActive }) =>
                                    isActive
                                        ? "nav-link active fw-bold"
                                        : "nav-link"
                                }
                                to="/vendedor/ubicacion"
                            >
                                Ubicación
                            </NavLink>
                        </li>

                    </ul>
                </div>

            </div>
        </nav>
    )
}

export default VendedorNavbar