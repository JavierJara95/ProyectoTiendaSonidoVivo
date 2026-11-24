package com.sonidovivo.pedidos.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record EntregaRequest(
        @NotBlank String tipo,
        @Size(max = 30) String transportista,
        @Size(max = 250) String direccion,
        @Size(max = 120) String comuna,
        @Size(max = 120) String region) { }
