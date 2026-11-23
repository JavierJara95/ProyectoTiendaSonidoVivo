package com.sonidovivo.pedidos.model;

/** Permite detectar incidencias cuando falla una llamada entre microservicios. */
public enum EstadoStock {
    PENDIENTE, CONFIRMADO, INCIDENCIA
}
