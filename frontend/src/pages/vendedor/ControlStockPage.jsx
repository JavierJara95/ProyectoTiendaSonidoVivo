import { useEffect, useState } from "react";
import { Boxes, TriangleAlert, PackageX } from "../../components/ui/Icons";
import { productosIniciales } from "../../data/productosVendedor";
import StockRow from "../../components/vendedor/StockRow";
import PageHeader from "../../components/ui/PageHeader";
import StatCard from "../../components/ui/StatCard";
import { cargarDatos, guardarDatos } from "../../utils/storageVendedor";

export default function ControlStockPage() {
  const [productos, setProductos] = useState(() =>
    cargarDatos("sonidoVivo_productos", productosIniciales),
  );
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    guardarDatos("sonidoVivo_productos", productos);
  }, [productos]);

  const aumentarStock = (id) => {
    setProductos((actuales) =>
      actuales.map((producto) =>
        producto.id === id ? { ...producto, stock: producto.stock + 1 } : producto,
      ),
    );
  };

  const disminuirStock = (id) => {
    setProductos((actuales) =>
      actuales.map((producto) =>
        producto.id === id && producto.stock > 0
          ? { ...producto, stock: producto.stock - 1 }
          : producto,
      ),
    );
  };

  const totalProductos = productos.length;
  const productosSinStock = productos.filter((producto) => producto.stock === 0).length;
  const productosStockCritico = productos.filter(
    (producto) => producto.stock > 0 && producto.stock <= 2,
  ).length;
  const productosFiltrados = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(busqueda.toLowerCase()),
  );

  return (
    <section className="module-page">
      <PageHeader
        eyebrow="INVENTARIO"
        title="Control de Stock"
        description="Consulta y ajusta rápidamente las existencias disponibles de Sonido Vivo."
      />

      <div className="stats-grid stats-three">
        <StatCard title="Productos" value={totalProductos} detail="Referencias visibles" Icon={Boxes} />
        <StatCard title="Stock crítico" value={productosStockCritico} detail="Dos unidades o menos" Icon={TriangleAlert} accent />
        <StatCard title="Sin stock" value={productosSinStock} detail="Requieren reposición" Icon={PackageX} />
      </div>

      <div className="panel vendor-stock-panel">
        <div className="panel-heading vendor-stock-heading">
          <div>
            <h2>Inventario disponible</h2>
            <p>Ajusta unidades sin permitir valores negativos.</p>
          </div>
          <div className="vendor-search">
            <label htmlFor="buscarProducto" className="form-label">Buscar producto</label>
            <input
              id="buscarProducto"
              type="text"
              className="form-control"
              placeholder="Ej: guitarra"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="table sv-table vendor-stock-table">
            <thead>
              <tr>
                <th>Producto</th><th>Categoría</th><th>Stock</th><th>Precio</th><th>Acciones</th>
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
      </div>

      <div className="vendor-alerts">
        {productosStockCritico > 0 && <div className="alert alert-warning">Atención: existen productos con stock crítico.</div>}
        {productosSinStock > 0 && <div className="alert alert-danger">Existen productos sin stock disponible.</div>}
        {productosFiltrados.length === 0 && <div className="alert alert-warning">No se encontraron productos.</div>}
      </div>
    </section>
  );
}
