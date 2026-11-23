package com.sonidovivo.catalogo.dto;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
public record DescontarStockRequest(@NotNull @Min(1) Integer cantidad) {}
