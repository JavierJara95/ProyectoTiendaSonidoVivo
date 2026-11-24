package com.sonidovivo.usuarios.model;

import jakarta.persistence.*;

@Entity
@Table(name = "roles")
public class Rol {
    @Id
    @Column(length = 20)
    public String nombre;
}
