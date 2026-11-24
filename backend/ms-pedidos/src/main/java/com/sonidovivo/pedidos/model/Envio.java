package com.sonidovivo.pedidos.model;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "envios")
public class Envio {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "pedido_id", nullable = false, unique = true)
    private Pedido pedido;
    @Enumerated(EnumType.STRING) @JdbcTypeCode(SqlTypes.VARCHAR) @Column(nullable = false, length = 30)
    private ModalidadEntrega modalidad;
    @Column(length = 30)
    private String transportista;
    @Column(length = 250)
    private String direccion;
    @Column(length = 120)
    private String comuna;
    @Column(length = 120)
    private String region;
    @Column(name = "codigo_seguimiento", length = 100)
    private String codigoSeguimiento;

    public Long getId() { return id; }
    public Pedido getPedido() { return pedido; }
    public void setPedido(Pedido pedido) { this.pedido = pedido; }
    public ModalidadEntrega getModalidad() { return modalidad; }
    public void setModalidad(ModalidadEntrega modalidad) { this.modalidad = modalidad; }
    public String getTransportista() { return transportista; }
    public void setTransportista(String transportista) { this.transportista = transportista; }
    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }
    public String getComuna() { return comuna; }
    public void setComuna(String comuna) { this.comuna = comuna; }
    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }
    public String getCodigoSeguimiento() { return codigoSeguimiento; }
    public void setCodigoSeguimiento(String codigoSeguimiento) { this.codigoSeguimiento = codigoSeguimiento; }
}
