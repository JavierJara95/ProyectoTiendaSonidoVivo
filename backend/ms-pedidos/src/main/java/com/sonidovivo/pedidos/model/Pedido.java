package com.sonidovivo.pedidos.model;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "pedidos")
public class Pedido {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Version @Column(nullable = false)
    private Long version;
    @Column(nullable = false, unique = true, length = 40)
    private String folio;
    @Column(name = "cliente_id", nullable = false, length = 150)
    private String clienteId;
    @Column(name = "cliente_nombre", nullable = false, length = 160)
    private String clienteNombre;
    @Column(name = "cliente_correo", nullable = false, length = 180)
    private String clienteCorreo;
    @Column(name = "cliente_telefono", nullable = false, length = 30)
    private String clienteTelefono;
    @Column(name = "fecha_creacion", nullable = false)
    private LocalDateTime fechaCreacion;
    @Enumerated(EnumType.STRING) @JdbcTypeCode(SqlTypes.VARCHAR) @Column(nullable = false, length = 30)
    private EstadoPedido estado = EstadoPedido.EN_PREPARACION;
    @Enumerated(EnumType.STRING) @JdbcTypeCode(SqlTypes.VARCHAR) @Column(name = "estado_stock", nullable = false, length = 30)
    private EstadoStock estadoStock = EstadoStock.PENDIENTE;
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal total = BigDecimal.ZERO;
    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("id ASC")
    private List<DetallePedido> detalles = new ArrayList<>();
    @OneToOne(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Envio envio;

    public void agregarDetalle(DetallePedido d) { d.setPedido(this); detalles.add(d); }
    public void asignarEnvio(Envio e) { e.setPedido(this); envio = e; }
    public Long getId() { return id; }
    public String getFolio() { return folio; }
    public void setFolio(String folio) { this.folio = folio; }
    public String getClienteId() { return clienteId; }
    public void setClienteId(String clienteId) { this.clienteId = clienteId; }
    public String getClienteNombre() { return clienteNombre; }
    public void setClienteNombre(String clienteNombre) { this.clienteNombre = clienteNombre; }
    public String getClienteCorreo() { return clienteCorreo; }
    public void setClienteCorreo(String clienteCorreo) { this.clienteCorreo = clienteCorreo; }
    public String getClienteTelefono() { return clienteTelefono; }
    public void setClienteTelefono(String clienteTelefono) { this.clienteTelefono = clienteTelefono; }
    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }
    public EstadoPedido getEstado() { return estado; }
    public void setEstado(EstadoPedido estado) { this.estado = estado; }
    public EstadoStock getEstadoStock() { return estadoStock; }
    public void setEstadoStock(EstadoStock estadoStock) { this.estadoStock = estadoStock; }
    public BigDecimal getTotal() { return total; }
    public void setTotal(BigDecimal total) { this.total = total; }
    public List<DetallePedido> getDetalles() { return detalles; }
    public Envio getEnvio() { return envio; }
}
