import { useEffect, useState } from "react"
import { productosIniciales } from "../../data/productos"
import StockRow from "../../components/vendedor/StockRow"
import {
    cargarDatos,
    guardarDatos
} from "../../utils/storage"

function ControlStockPage() {
    const [productos, setProductos] = useState(() =>
        cargarDatos(
            "sonidoVivo_productos",
            productosIniciales
        )
    )
    useEffect(() => {
        guardarDatos(
            "sonidoVivo_productos",
            productos
        )
    }, [productos])

    const [busqueda, setBusqueda] = useState("")

    const aumentarStock = (id) => {
        setProductos((productosActuales) =>
            productosActuales.map((producto) =>
                producto.id === id
                    ? {
                        ...producto,
                        stock: producto.stock + 1
                    }
                    : producto
            )
        )
    }

    const disminuirStock = (id) => {
        setProductos((productosActuales) =>
            productosActuales.map((producto) =>
                producto.id === id && producto.stock > 0
                    ? {
                        ...producto,
                        stock: producto.stock - 1
                    }
                    : producto
            )
        )
    }
    const totalProductos = productos.length

    const productosSinStock = productos.filter(
        (producto) => producto.stock === 0
    ).length

    const productosStockCritico = productos.filter(
        (producto) =>
            producto.stock > 0 &&
            producto.stock <= 2
    ).length

    const productosFiltrados = productos.filter((producto) =>
        producto.nombre
            .toLowerCase()
            .includes(busqueda.toLowerCase())
    )

    return (
        <div className="container py-4">

            <div className="mb-4">
                <h1>Control de Stock</h1>

                <p className="text-muted">
                    Actualiza el inventario disponible de Sonido Vivo.
                </p>
            </div>

            <div className="mb-4">
                <label
                    htmlFor="buscarProducto"
                    className="form-label"
                >
                    Buscar producto
                </label>
                <div className="row g-3 mb-4">

                    <div className="col-12 col-md-4">
                        <div className="card shadow-sm text-center h-100">

                            <div className="card-body">

                                <h3 className="h6 text-muted">
                                    Productos
                                </h3>

                                <p className="display-6 mb-0">
                                    {totalProductos}
                                </p>

                            </div>

                        </div>
                    </div>


                    <div className="col-12 col-md-4">
                        <div className="card shadow-sm text-center h-100">

                            <div className="card-body">

                                <h3 className="h6 text-muted">
                                    Stock crítico
                                </h3>

                                <p className="display-6 mb-0">
                                    {productosStockCritico}
                                </p>

                            </div>

                        </div>
                    </div>


                    <div className="col-12 col-md-4">
                        <div className="card shadow-sm text-center h-100">

                            <div className="card-body">

                                <h3 className="h6 text-muted">
                                    Sin stock
                                </h3>

                                <p className="display-6 mb-0">
                                    {productosSinStock}
                                </p>

                            </div>

                        </div>
                    </div>

                </div>
                <input
                    id="buscarProducto"
                    type="text"
                    className="form-control"
                    placeholder="Ej: guitarra"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />
            </div>

            <div className="table-responsive">
                <table className="table table-striped table-hover align-middle">

                    <thead className="table-dark">
                        <tr>
                            <th>Producto</th>
                            <th>Categoría</th>
                            <th>Stock</th>
                            <th>Precio</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {productosFiltrados.map((producto) => (
                            <StockRow
                                key={producto.id}
                                producto={producto}
                                onAumentar={aumentarStock}
                                onDisminuir={disminuirStock}
                            />
                        ))}
                    </tbody>

                </table>
            </div>
            {productosStockCritico > 0 && (
                <div className="alert alert-warning">
                    Atención: existen productos con
                    stock crítico.
                </div>
            )}
            {productosSinStock > 0 && (
                <div className="alert alert-danger">
                    Existen productos sin stock disponible.
                </div>
            )}

            {productosFiltrados.length === 0 && (
                <div className="alert alert-warning">
                    No se encontraron productos.
                </div>
            )}

        </div>
    )

}

export default ControlStockPage