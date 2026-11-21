package com.sonidovivo.catalogo.dto;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
public record ProductoRequest(@NotBlank @Size(max=20) String codigo,@NotBlank @Size(max=180) String nombre,
 @NotBlank @Size(max=100) String modelo,@Size(max=1000) String descripcion,
 @NotNull @DecimalMin("0.0") @Digits(integer=12,fraction=2) BigDecimal precio,
 @NotNull @Min(0) Integer stock,@NotNull Long categoriaId,@NotNull Long marcaId) {}
