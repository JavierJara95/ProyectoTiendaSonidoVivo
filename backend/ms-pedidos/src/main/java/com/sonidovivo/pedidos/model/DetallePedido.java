package com.sonidovivo.pedidos.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "detalles_pedido", uniqueConstraints = @UniqueConstraint(name = "uq_detalle_producto", columnNames = {"pedido_id", "producto_id"}))
public class DetallePedido {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "pedido_id", nullable = false)
    private Pedido pedido;
    @Column(name = "producto_id", nullable = false)
    private Long productoId;
    @Column(nullable = false, length = 50)
    private String codigo;
    @Column(nullable = false, length = 200)
    private String nombre;
    @Column(name = "precio_unitario", nullable = false, precision = 15, scale = 2)
    private BigDecimal precioUnitario;
    @Column(nullable = false)
    private Integer cantidad;
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal subtotal;
    @Column(name = "stock_descontado", nullable = false)
    private boolean stockDescontado;

    public Long getId() { return id; }
    public Pedido getPedido() { return pedido; }
    public void setPedido(Pedido pedido) { this.pedido = pedido; }
    public Long getProductoId() { return productoId; }
    public void setProductoId(Long productoId) { this.productoId = productoId; }
    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public BigDecimal getPrecioUnitario() { return precioUnitario; }
    public void setPrecioUnitario(BigDecimal precioUnitario) { this.precioUnitario = precioUnitario; }
    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }
    public boolean isStockDescontado() { return stockDescontado; }
    public void setStockDescontado(boolean stockDescontado) { this.stockDescontado = stockDescontado; }
}
