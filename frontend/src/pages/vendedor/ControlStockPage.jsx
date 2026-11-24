import { useEffect, useState } from "react";
import { Boxes, TriangleAlert, PackageX } from "../../components/ui/Icons";
import { listProducts, changeStock } from "../../services/catalogoService";
import StockRow from "../../components/vendedor/StockRow";
import PageHeader from "../../components/ui/PageHeader";
import StatCard from "../../components/ui/StatCard";


export default function ControlStockPage() {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const cargar = async () => {
    try { setProductos(await listProducts()); setError(''); }
    catch (e) { setError(e.message); }
  };
  useEffect(() => { cargar(); }, []);
  const ajustar = async (id, delta) => {
    const producto = productos.find(p => p.id === id);
    if (!producto || busy || producto.stock + delta < 0) return;
    setBusy(true);
    try { await changeStock(producto, producto.stock + delta); await cargar(); }
    catch (e) { setError(e.message); }
    finally { setBusy(false); }
  };
  const aumentarStock = id => ajustar(id, 1);
  const disminuirStock = id => ajustar(id, -1);

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

      {error && <div role="alert" className="alert alert-danger">{error}</div>}
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
