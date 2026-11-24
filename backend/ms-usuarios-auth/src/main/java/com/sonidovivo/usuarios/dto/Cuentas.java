package com.sonidovivo.usuarios.dto;

import com.sonidovivo.usuarios.model.Usuario;
import jakarta.validation.constraints.*;
import java.util.Locale;

public class Cuentas {
    public record Login(@NotBlank @Email String email, @NotBlank String password) {}
    public record Registro(@NotBlank @Size(min=2,max=100) String nombre,
                           @NotBlank @Email @Size(max=254) String email, @NotBlank String password) {}
    public record Edicion(@NotBlank @Size(min=2,max=100) String nombre,
                          @NotBlank @Email @Size(max=254) String email, String password,
                          @NotBlank @Pattern(regexp="admin|vendedor|cliente") String rol, Boolean activo) {}
    public record Estado(@NotNull Boolean activo) {}
    public record Vista(Long id, String nombre, String email, String rol, boolean activo) {
        public static Vista de(Usuario u) {
            return new Vista(u.id, u.nombre, u.email, u.rol.nombre.substring(5).toLowerCase(Locale.ROOT), u.activo);
        }
    }
    public record Sesion(String token, long expiresAt, Vista user) {}
}
