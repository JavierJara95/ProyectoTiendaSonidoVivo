package com.sonidovivo.catalogo.dto;
import com.sonidovivo.catalogo.model.Categoria;
public record CategoriaResponse(Long id,String nombre,String descripcion){public static CategoriaResponse from(Categoria c){return new CategoriaResponse(c.getId(),c.getNombre(),c.getDescripcion());}}
