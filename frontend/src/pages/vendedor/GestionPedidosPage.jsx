import { useEffect, useState } from "react"

import { pedidosIniciales } from "../../data/pedidos"
import PedidoCard from "../../components/vendedor/PedidoCard"

import {
  cargarDatos,
  guardarDatos
} from "../../utils/storage"

function GestionPedidosPage() {
  const [pedidos, setPedidos] = useState(() =>
  cargarDatos(
    "sonidoVivo_pedidos",
    pedidosIniciales
  )
)
useEffect(() => {
  guardarDatos(
    "sonidoVivo_pedidos",
    pedidos
  )
}, [pedidos])

  const cambiarEstado = (id, nuevoEstado) => {
    setPedidos((pedidosActuales) =>
      pedidosActuales.map((pedido) =>
        pedido.id === id
          ? { ...pedido, estado: nuevoEstado }
          : pedido
      )
    )
  }

  const guardarSeguimiento = (id, nuevoNumero) => {
    setPedidos((pedidosActuales) =>
      pedidosActuales.map((pedido) =>
        pedido.id === id
          ? { ...pedido, numeroSeguimiento: nuevoNumero }
          : pedido
      )
    )
  }

  return (
    <div className="container py-4">

      <div className="mb-4">
        <h1>Gestión de Pedidos</h1>
        <p className="text-muted">
          Revisa y actualiza los pedidos remotos de Sonido Vivo.
        </p>
      </div>

      <div className="row">
        {pedidos.map((pedido) => (
          <div
            className="col-12 col-md-6 col-xl-4"
            key={pedido.id}
          >
            <PedidoCard
              pedido={pedido}
              onCambiarEstado={cambiarEstado}
              onGuardarSeguimiento={guardarSeguimiento}
            />
          </div>
        ))}
      </div>

    </div>
  )
}

export default GestionPedidosPage