import "leaflet/dist/leaflet.css"

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from "react-leaflet"

import L from "leaflet"

import iconRetina from "leaflet/dist/images/marker-icon-2x.png"
import icon from "leaflet/dist/images/marker-icon.png"
import shadow from "leaflet/dist/images/marker-shadow.png"

import { puntosRetiro } from "../../data/puntosRetiro"
import PuntoRetiroCard from "../../components/vendedor/PuntoRetiroCard"


delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetina,
  iconUrl: icon,
  shadowUrl: shadow
})


function UbicacionTiendaPage() {

  const centroMapa = [-33.0245, -71.5518]

  return (
    <div className="container py-4">

      <div className="mb-4">
        <h1>Ubicación de la Tienda</h1>

        <p className="text-muted">
          Consulta la tienda principal y los puntos de retiro disponibles.
        </p>
      </div>


      <div className="row g-4">

        <div className="col-12 col-lg-8">

          <div className="mapa-contenedor">

            <MapContainer
              center={centroMapa}
              zoom={13}
              scrollWheelZoom={true}
              className="mapa-leaflet"
            >

              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {puntosRetiro.map((punto) => (

                <Marker
                  key={punto.id}
                  position={[
                    punto.latitud,
                    punto.longitud
                  ]}
                >

                  <Popup>
                    <strong>
                      {punto.nombre}
                    </strong>

                    <br />

                    {punto.direccion}
                  </Popup>

                </Marker>

              ))}

            </MapContainer>

          </div>

        </div>


        <div className="col-12 col-lg-4">

          <h2 className="h4 mb-3">
            Puntos disponibles
          </h2>

          {puntosRetiro.map((punto) => (

            <PuntoRetiroCard
              key={punto.id}
              punto={punto}
            />

          ))}

        </div>

      </div>

    </div>
  )
}

export default UbicacionTiendaPage