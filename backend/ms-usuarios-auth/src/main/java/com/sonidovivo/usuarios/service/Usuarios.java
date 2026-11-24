package com.sonidovivo.usuarios.service;

import com.sonidovivo.usuarios.dto.Cuentas.*;
import com.sonidovivo.usuarios.model.Usuario;
import com.sonidovivo.usuarios.repository.*;
import java.nio.charset.StandardCharsets;
import java.util.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional
public class Usuarios {
    private final UsuarioRepository cuentas;
    private final RolRepository roles;
    private final PasswordEncoder bcrypt;

    public Usuarios(UsuarioRepository cuentas, RolRepository roles, PasswordEncoder bcrypt) {
        this.cuentas = cuentas;
        this.roles = roles;
        this.bcrypt = bcrypt;
    }

    public List<Vista> listar() { return cuentas.findAll().stream().map(Vista::de).toList(); }

    public Usuario obtener(long id) {
        return cuentas.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario inexistente."));
    }

    public Usuario autenticar(Login datos) {
        return cuentas.findByEmail(normalizar(datos.email()))
            .filter(u -> u.activo && bcrypt.matches(datos.password(), u.passwordHash))
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Correo o contraseña incorrectos, o cuenta inactiva."));
    }

    public Usuario crear(Edicion datos) {
        Usuario u = new Usuario();
        aplicar(u, datos);
        u.activo = !Boolean.FALSE.equals(datos.activo());
        return cuentas.saveAndFlush(u);
    }

    public Vista editar(long actor, long id, Edicion datos) {
        Usuario u = obtener(id);
        if (actor == id && (!"admin".equals(datos.rol()) || Boolean.FALSE.equals(datos.activo()))) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "No puedes quitarte el rol de administrador ni desactivarte.");
        }
        aplicar(u, datos);
        if (datos.activo() != null) u.activo = datos.activo();
        return Vista.de(cuentas.saveAndFlush(u));
    }

    public Vista estado(long actor, long id, boolean activo) {
        if (actor == id && !activo) throw new ResponseStatusException(HttpStatus.CONFLICT, "No puedes desactivar tu cuenta.");
        Usuario u = obtener(id);
        u.activo = activo;
        return Vista.de(cuentas.saveAndFlush(u));
    }

    public void borrar(long actor, long id) {
        if (actor == id) throw new ResponseStatusException(HttpStatus.CONFLICT, "No puedes eliminar tu propia cuenta.");
        cuentas.delete(obtener(id));
    }

    private static String normalizar(String email) { return email.strip().toLowerCase(Locale.ROOT); }

    private void aplicar(Usuario u, Edicion datos) {
        if (datos.nombre().strip().length() < 2) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nombre demasiado corto.");
        u.nombre = datos.nombre().strip();
        u.email = normalizar(datos.email());
        u.rol = roles.findById("ROLE_" + datos.rol().toUpperCase(Locale.ROOT)).orElseThrow();
        String clave = datos.password();
        if (u.id == null || (clave != null && !clave.isEmpty())) {
            if (clave == null || clave.length() < 8 || clave.getBytes(StandardCharsets.UTF_8).length > 72
                    || !clave.matches("(?s).*[A-Z].*") || !clave.matches("(?s).*[a-z].*") || !clave.matches("(?s).*[0-9].*")) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Usa al menos 8 caracteres, una mayúscula, una minúscula y un número (máximo 72 bytes).");
            }
            u.passwordHash = bcrypt.encode(clave);
        }
    }
}
