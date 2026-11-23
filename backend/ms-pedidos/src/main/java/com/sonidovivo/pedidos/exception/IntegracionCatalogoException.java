package com.sonidovivo.pedidos.exception;

public class IntegracionCatalogoException extends RuntimeException {
    private final boolean conflicto;
    public IntegracionCatalogoException(String message, boolean conflicto) { super(message); this.conflicto = conflicto; }
    public boolean isConflicto() { return conflicto; }
}
