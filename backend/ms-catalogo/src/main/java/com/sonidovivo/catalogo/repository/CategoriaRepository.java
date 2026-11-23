package com.sonidovivo.catalogo.repository;
import com.sonidovivo.catalogo.model.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
public interface CategoriaRepository extends JpaRepository<Categoria,Long>{boolean existsByNombreIgnoreCase(String nombre);}
