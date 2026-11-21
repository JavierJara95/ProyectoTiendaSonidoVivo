package com.sonidovivo.catalogo.model;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
@Entity @Table(name="productos", uniqueConstraints=@UniqueConstraint(name="uk_producto_codigo",columnNames="codigo"))
public class Producto {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @NotBlank @Size(max=20) @Column(nullable=false,length=20) private String codigo;
 @NotBlank @Size(max=180) @Column(nullable=false,length=180) private String nombre;
 @NotBlank @Size(max=100) @Column(nullable=false,length=100) private String modelo;
 @Size(max=1000) @Column(length=1000) private String descripcion;
 @NotNull @DecimalMin("0.0") @Digits(integer=12,fraction=2) @Column(nullable=false,precision=14,scale=2) private BigDecimal precio;
 @NotNull @Min(0) @Column(nullable=false) private Integer stock;
 @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="categoria_id",nullable=false) private Categoria categoria;
 @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="marca_id",nullable=false) private Marca marca;
 public Producto() {}
 public Long getId(){return id;} public String getCodigo(){return codigo;} public void setCodigo(String v){codigo=v;}
 public String getNombre(){return nombre;} public void setNombre(String v){nombre=v;}
 public String getModelo(){return modelo;} public void setModelo(String v){modelo=v;}
 public String getDescripcion(){return descripcion;} public void setDescripcion(String v){descripcion=v;}
 public BigDecimal getPrecio(){return precio;} public void setPrecio(BigDecimal v){precio=v;}
 public Integer getStock(){return stock;} public void setStock(Integer v){stock=v;}
 public Categoria getCategoria(){return categoria;} public void setCategoria(Categoria v){categoria=v;}
 public Marca getMarca(){return marca;} public void setMarca(Marca v){marca=v;}
}
