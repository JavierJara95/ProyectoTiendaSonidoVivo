package com.sonidovivo.usuarios.model;

import jakarta.persistence.*;

@Entity
@Table(name = "usuarios")
public class Usuario {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;
    @Column(nullable = false, length = 100)
    public String nombre;
    @Column(nullable = false, unique = true, length = 254)
    public String email;
    @Column(name = "password_hash", nullable = false, length = 100)
    public String passwordHash;
    @ManyToOne(optional = false)
    @JoinColumn(name = "rol")
    public Rol rol;
    public boolean activo;
    @Version
    public long version;
}
