package com.sonidovivo.pedidos.dto;

import jakarta.validation.constraints.*;

public record ClienteRequest(
        @NotBlank @Size(max = 160) String nombre,
        @NotBlank @Email @Size(max = 180) String correo,
        @NotBlank @Pattern(regexp = "^[+0-9 ()-]{8,30}$") String telefono) { }
