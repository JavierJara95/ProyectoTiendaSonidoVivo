package com.sonidovivo.pedidos.dto;

import com.sonidovivo.pedidos.model.EstadoPedido;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CambiarEstadoRequest(@NotNull EstadoPedido estado, @Size(max = 100) String numeroSeguimiento) { }
