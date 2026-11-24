package com.sonidovivo.pedidos.dto;

import com.sonidovivo.pedidos.model.DetallePedido;
import java.math.BigDecimal;

public record DetallePedidoResponse(Long id, Long productoId, String codigo, String nombre, BigDecimal precioUnitario,
                                    Integer cantidad, BigDecimal subtotal, boolean stockDescontado) {
    public static DetallePedidoResponse from(DetallePedido d) {
        return new DetallePedidoResponse(d.getId(), d.getProductoId(), d.getCodigo(), d.getNombre(),
                d.getPrecioUnitario(), d.getCantidad(), d.getSubtotal(), d.isStockDescontado());
    }
}
