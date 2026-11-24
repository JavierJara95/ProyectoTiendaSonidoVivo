package com.sonidovivo.pedidos.service;

import com.sonidovivo.pedidos.dto.*;
import com.sonidovivo.pedidos.exception.*;
import com.sonidovivo.pedidos.model.*;
import com.sonidovivo.pedidos.repository.PedidoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

/** Delimita las transacciones de la BD de pedidos, separadas de HTTP a catálogo. */
@Service
public class PedidoPersistenciaService {
    private final PedidoRepository pedidos;
    public PedidoPersistenciaService(PedidoRepository pedidos) { this.pedidos = pedidos; }

    @Transactional
    public Pedido guardarNuevo(Pedido p) { return pedidos.saveAndFlush(p); }

    @Transactional
    public void marcarDescontado(Long id, Long productoId) {
        Pedido p = buscar(id);
        DetallePedido detalle = p.getDetalles().stream().filter(d -> d.getProductoId().equals(productoId))
                .findFirst().orElseThrow(() -> new RecursoNoEncontradoException("Detalle de producto no encontrado"));
        detalle.setStockDescontado(true);
    }

    @Transactional
    public void marcarConfirmado(Long id) {
        Pedido p = buscar(id);
        if (p.getDetalles().stream().anyMatch(d -> !d.isStockDescontado()))
            throw new ReglaNegocioException("No se puede confirmar sin descuento completo de stock");
        p.setEstadoStock(EstadoStock.CONFIRMADO);
    }

    @Transactional
    public void marcarIncidencia(Long id) { buscar(id).setEstadoStock(EstadoStock.INCIDENCIA); }

    @Transactional(readOnly = true)
    public Pedido buscar(Long id) {
        return pedidos.findById(id).orElseThrow(() -> new RecursoNoEncontradoException("Pedido no encontrado: " + id));
    }

    @Transactional(readOnly = true)
    public Pedido buscarFolio(String folio) {
        return pedidos.findByFolio(folio).orElseThrow(() -> new RecursoNoEncontradoException("Pedido no encontrado"));
    }

    @Transactional(readOnly = true)
    public List<Pedido> porCliente(String clienteId) { return pedidos.findByClienteIdOrderByFechaCreacionDesc(clienteId); }

    @Transactional(readOnly = true)
    public List<Pedido> todos() { return pedidos.findAllByOrderByFechaCreacionDesc(); }

    @Transactional(readOnly = true)
    public List<Pedido> entreFechas(LocalDateTime desde, LocalDateTime hasta) {
        return pedidos.findByFechaCreacionGreaterThanEqualAndFechaCreacionLessThanOrderByFechaCreacionDesc(desde, hasta);
    }

    @Transactional
    public Pedido cambiarEstado(Long id, CambiarEstadoRequest request) {
        Pedido p = buscar(id);
        if (p.getEstadoStock() != EstadoStock.CONFIRMADO)
            throw new ReglaNegocioException("No se puede despachar un pedido con stock pendiente o en incidencia");
        EstadoPedido actual = p.getEstado();
        EstadoPedido nuevo = request.estado();
        ModalidadEntrega modalidad = p.getEnvio().getModalidad();
        boolean transicionValida = (actual == EstadoPedido.EN_PREPARACION
                        && ((modalidad == ModalidadEntrega.DESPACHO_DOMICILIO && nuevo == EstadoPedido.DESPACHADO)
                        || (modalidad == ModalidadEntrega.RETIRO_TIENDA && nuevo == EstadoPedido.ENTREGADO)))
                || (actual == EstadoPedido.DESPACHADO && nuevo == EstadoPedido.ENTREGADO);
        if (!transicionValida) throw new ReglaNegocioException("Transición de estado no permitida: " + actual + " → " + nuevo);
        if (nuevo == EstadoPedido.DESPACHADO) {
            String codigo = request.numeroSeguimiento();
            if (codigo == null || codigo.isBlank())
                throw new ReglaNegocioException("Se requiere número de seguimiento al despachar");
            p.getEnvio().setCodigoSeguimiento(codigo.trim());
        }
        p.setEstado(nuevo);
        return p;
    }

    /** No es legal borrar pedidos confirmados: el stock ya fue descontado y se perdería la trazabilidad. */
    @Transactional
    public void eliminarIncidenciaSinStock(Long id) {
        Pedido p = buscar(id);
        if (p.getEstadoStock() != EstadoStock.INCIDENCIA
                || p.getDetalles().stream().anyMatch(DetallePedido::isStockDescontado))
            throw new ReglaNegocioException("Solo es posible eliminar incidencias sin ningún descuento de stock");
        pedidos.delete(p);
    }
}
