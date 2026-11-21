package com.sonidovivo.catalogo.dto;
import jakarta.validation.constraints.*;
public record CategoriaRequest(@NotBlank @Size(max=100) String nombre,@Size(max=500) String descripcion) {}
