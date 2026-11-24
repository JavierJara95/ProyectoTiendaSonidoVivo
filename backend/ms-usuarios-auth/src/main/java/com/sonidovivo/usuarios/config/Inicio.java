package com.sonidovivo.usuarios.config;

import com.sonidovivo.usuarios.dto.Cuentas.Edicion;
import com.sonidovivo.usuarios.repository.UsuarioRepository;
import com.sonidovivo.usuarios.service.Usuarios;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.*;
import org.springframework.beans.factory.annotation.Value;

@Configuration
@SecurityScheme(name="bearerAuth", type=SecuritySchemeType.HTTP, scheme="bearer", bearerFormat="JWT")
public class Inicio {
    @Bean ApplicationRunner primerAdmin(UsuarioRepository repo, Usuarios usuarios,
            @Value("${ADMIN_PASSWORD:}") String password) {
        return args -> {
            if (repo.count() == 0) {
                if (password.isBlank()) throw new IllegalStateException("Define ADMIN_PASSWORD para crear el primer administrador.");
                usuarios.crear(new Edicion("Administrador", "admin@sonidovivo.cl", password, "admin", true));
            }
        };
    }
}
