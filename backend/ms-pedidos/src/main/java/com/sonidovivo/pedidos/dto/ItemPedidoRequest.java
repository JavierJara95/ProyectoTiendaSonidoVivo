package com.sonidovivo.pedidos.dto;

import jakarta.validation.constraints.*;

/** Se admite productoId o codigo para facilitar la integración con la tienda React existente. */
public record ItemPedidoRequest(Long productoId, String codigo, @NotNull @Min(1) Integer cantidad) { }
