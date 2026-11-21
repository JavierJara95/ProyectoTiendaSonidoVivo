package com.sonidovivo.catalogo.dto;
import com.sonidovivo.catalogo.model.Producto;
import java.math.BigDecimal;
public record ProductoResponse(Long id,String codigo,String nombre,String modelo,String descripcion,BigDecimal precio,Integer stock,
 Long categoriaId,String categoria,Long marcaId,String marca) {
 public static ProductoResponse from(Producto p){return new ProductoResponse(p.getId(),p.getCodigo(),p.getNombre(),p.getModelo(),p.getDescripcion(),p.getPrecio(),p.getStock(),p.getCategoria().getId(),p.getCategoria().getNombre(),p.getMarca().getId(),p.getMarca().getNombre());}
}
