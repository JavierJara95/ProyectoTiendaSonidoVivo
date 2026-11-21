package com.sonidovivo.catalogo.repository;

import com.sonidovivo.catalogo.model.Producto;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface ProductoRepository extends JpaRepository<Producto, Long> {

    @EntityGraph(attributePaths = {"categoria", "marca"})
    @Query("""
        select p from Producto p
        where (
            :texto is null
            or lower(p.nombre) like lower(concat('%', :texto, '%'))
            or lower(p.codigo) like lower(concat('%', :texto, '%'))
        )
        and (:categoriaId is null or p.categoria.id = :categoriaId)
        and (:precioMin is null or p.precio >= :precioMin)
        and (:precioMax is null or p.precio <= :precioMax)
        order by p.id
        """)
    List<Producto> buscar(
        @Param("texto") String texto,
        @Param("categoriaId") Long categoriaId,
        @Param("precioMin") BigDecimal precioMin,
        @Param("precioMax") BigDecimal precioMax
    );

    @Query(
        value = "SELECT * FROM productos WHERE id = :id FOR UPDATE",
        nativeQuery = true
    )
    Optional<Producto> buscarPorIdConBloqueo(@Param("id") Long id);

    boolean existsByCodigoIgnoreCase(String codigo);
}