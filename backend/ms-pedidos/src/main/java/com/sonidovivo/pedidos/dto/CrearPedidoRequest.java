package com.sonidovivo.pedidos.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.util.List;

public record CrearPedidoRequest(
        @NotNull @Valid ClienteRequest cliente,
        @NotEmpty List<@NotNull @Valid ItemPedidoRequest> items,
        @NotNull @Valid EntregaRequest entrega) { }
