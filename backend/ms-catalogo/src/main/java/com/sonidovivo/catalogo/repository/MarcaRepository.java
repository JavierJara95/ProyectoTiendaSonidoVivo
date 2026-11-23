package com.sonidovivo.catalogo.repository;
import com.sonidovivo.catalogo.model.Marca;
import org.springframework.data.jpa.repository.JpaRepository;
public interface MarcaRepository extends JpaRepository<Marca,Long>{boolean existsByNombreIgnoreCase(String nombre);}
