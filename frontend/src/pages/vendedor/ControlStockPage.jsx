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

      {productosFiltrados.length === 0 && (
        <div className="alert alert-warning">
          No se encontraron productos.
        </div>
      )}

    </div>
  )
}

export default ControlStockPage