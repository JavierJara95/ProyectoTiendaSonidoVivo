package com.sonidovivo.pedidos.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

/** Los importes reflejan pedidos confirmados, NO pagos efectivamente conciliados. */
public record ResumenPedidosResponse(LocalDate desde, LocalDate hasta, long pedidosConfirmados, long enPreparacion,
                                     long despachados, long entregados, long incidenciasStock, BigDecimal totalPedidos) { }
