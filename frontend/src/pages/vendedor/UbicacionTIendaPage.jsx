import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import iconRetina from "leaflet/dist/images/marker-icon-2x.png";
import icon from "leaflet/dist/images/marker-icon.png";
import shadow from "leaflet/dist/images/marker-shadow.png";
import { puntosRetiro } from "../../data/puntosRetiro";
import PuntoRetiroCard from "../../components/vendedor/PuntoRetiroCard";
import PageHeader from "../../components/ui/PageHeader";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl: iconRetina, iconUrl: icon, shadowUrl: shadow });

export default function UbicacionTiendaPage() {
  const centroMapa = [-33.0245, -71.5518];
  return (
    <section className="module-page">
      <PageHeader
        eyebrow="PUNTOS DE ATENCIÓN"
        title="Ubicación de la Tienda"
        description="Consulta la tienda principal y los puntos de retiro disponibles en Viña del Mar."
      />
      <div className="vendor-map-grid">
        <div className="panel vendor-map-panel">
          <div className="mapa-contenedor">
            <MapContainer center={centroMapa} zoom={13} scrollWheelZoom className="mapa-leaflet">
              <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {puntosRetiro.map((punto) => (
                <Marker key={punto.id} position={[punto.latitud, punto.longitud]}>
                  <Popup><strong>{punto.nombre}</strong><br />{punto.direccion}</Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
        <div>
          <h2 className="vendor-section-title">Puntos disponibles</h2>
          {puntosRetiro.map((punto) => <PuntoRetiroCard key={punto.id} punto={punto} />)}
        </div>
      </div>
    </section>
  );
}
