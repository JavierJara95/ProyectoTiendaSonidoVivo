package com.sonidovivo.pedidos.dto;

import java.math.BigDecimal;

/** Campos públicos reales que expone ms-catalogo de Valentina. */
public record ProductoCatalogoResponse(Long id, String codigo, String nombre, BigDecimal precio, Integer stock) { }
