package com.sonidovivo.catalogo.model;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
@Entity @Table(name="marcas")
public class Marca {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @NotBlank @Size(max=100) @Column(nullable=false,unique=true,length=100) private String nombre;
 public Marca() {} public Marca(String nombre){this.nombre=nombre;}
 public Long getId(){return id;} public String getNombre(){return nombre;} public void setNombre(String nombre){this.nombre=nombre;}
}
