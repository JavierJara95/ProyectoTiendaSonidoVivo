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

  const [filtroEstado, setFiltroEstado] =
    useState("Todos")


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
          ? {
              ...pedido,
              estado: nuevoEstado
            }
          : pedido
      )
    )
  }


  const guardarSeguimiento = (
    id,
    nuevoNumero
  ) => {

    setPedidos((pedidosActuales) =>
      pedidosActuales.map((pedido) =>
        pedido.id === id
          ? {
              ...pedido,
              numeroSeguimiento: nuevoNumero
            }
          : pedido
      )
    )
  }


  const totalPedidos = pedidos.length

  const pedidosPreparacion = pedidos.filter(
    (pedido) =>
      pedido.estado === "En preparación"
  ).length

  const pedidosDespachados = pedidos.filter(
    (pedido) =>
      pedido.estado === "Despachado"
  ).length

  const pedidosEntregados = pedidos.filter(
    (pedido) =>
      pedido.estado === "Entregado"
  ).length


  const pedidosFiltrados =
    filtroEstado === "Todos"
      ? pedidos
      : pedidos.filter(
          (pedido) =>
            pedido.estado === filtroEstado
        )


  return (
    <div className="container py-4">

      <div className="mb-4">

        <h1>
          Gestión de Pedidos
        </h1>

        <p className="text-muted">
          Revisa y actualiza los pedidos
          remotos de Sonido Vivo.
        </p>

      </div>


      <div className="row g-3 mb-4">

        <div className="col-6 col-lg-3">
          <div className="card shadow-sm text-center h-100">
            <div className="card-body">
              <h3 className="h6 text-muted">
                Total
              </h3>
              <p className="display-6 mb-0">
                {totalPedidos}
              </p>
            </div>
          </div>
        </div>


        <div className="col-6 col-lg-3">
          <div className="card shadow-sm text-center h-100">
            <div className="card-body">
              <h3 className="h6 text-muted">
                En preparación
              </h3>
              <p className="display-6 mb-0">
                {pedidosPreparacion}
              </p>
            </div>
          </div>
        </div>


        <div className="col-6 col-lg-3">
          <div className="card shadow-sm text-center h-100">
            <div className="card-body">
              <h3 className="h6 text-muted">
                Despachados
              </h3>
              <p className="display-6 mb-0">
                {pedidosDespachados}
              </p>
            </div>
          </div>
        </div>


        <div className="col-6 col-lg-3">
          <div className="card shadow-sm text-center h-100">
            <div className="card-body">
              <h3 className="h6 text-muted">
                Entregados
              </h3>
              <p className="display-6 mb-0">
                {pedidosEntregados}
              </p>
            </div>
          </div>
        </div>

      </div>


      <div className="mb-4">

        <label
          htmlFor="filtroEstado"
          className="form-label"
        >
          Filtrar por estado
        </label>

        <select
          id="filtroEstado"
          className="form-select"
          value={filtroEstado}
          onChange={(e) =>
            setFiltroEstado(e.target.value)
          }
        >

          <option value="Todos">
            Todos
          </option>

          <option value="En preparación">
            En preparación
          </option>

          <option value="Despachado">
            Despachado
          </option>

          <option value="Entregado">
            Entregado
          </option>

        </select>

      </div>


      <div className="row">

        {pedidosFiltrados.map((pedido) => (

          <div
            className="col-12 col-md-6 col-xl-4"
            key={pedido.id}
          >

            <PedidoCard
              pedido={pedido}
              onCambiarEstado={cambiarEstado}
              onGuardarSeguimiento={
                guardarSeguimiento
              }
            />

          </div>

        ))}

      </div>


      {pedidosFiltrados.length === 0 && (
        <div className="alert alert-info">
          No existen pedidos para este estado.
        </div>
      )}

    </div>
  )
}

export default GestionPedidosPage