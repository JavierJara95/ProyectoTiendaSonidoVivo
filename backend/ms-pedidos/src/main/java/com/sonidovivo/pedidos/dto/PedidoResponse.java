package com.sonidovivo.pedidos.dto;

import com.sonidovivo.pedidos.model.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record PedidoResponse(Long id, String folio, String clienteId, String clienteNombre, String clienteCorreo,
                             String clienteTelefono, EstadoPedido estado, String estadoDescripcion,
                             EstadoStock estadoStock, LocalDateTime fechaCreacion, BigDecimal total,
                             List<DetallePedidoResponse> items, EnvioResponse entrega) {
    public static PedidoResponse from(Pedido p) {
        String estado = switch (p.getEstado()) {
            case EN_PREPARACION -> "En preparación";
            case DESPACHADO -> "Despachado";
            case ENTREGADO -> "Entregado";
        };
        return new PedidoResponse(p.getId(), p.getFolio(), p.getClienteId(), p.getClienteNombre(),
                p.getClienteCorreo(), p.getClienteTelefono(), p.getEstado(), estado, p.getEstadoStock(),
                p.getFechaCreacion(), p.getTotal(), p.getDetalles().stream().map(DetallePedidoResponse::from).toList(),
                EnvioResponse.from(p.getEnvio()));
    }
}
