package com.sonidovivo.pedidos.exception;

public class IncidenciaStockException extends RuntimeException {
    private final String folio;
    private final boolean conflicto;
    public IncidenciaStockException(String folio, boolean conflicto) {
        super("No se pudo completar la sincronización de stock. Pedido " + folio + " registrado para revisión; no vuelvas a confirmar hasta verificarlo.");
        this.folio = folio;
        this.conflicto = conflicto;
    }
    public String getFolio() { return folio; }
    public boolean isConflicto() { return conflicto; }
}
