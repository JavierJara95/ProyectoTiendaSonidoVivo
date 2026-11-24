package com.sonidovivo.usuarios.controller;

import com.sonidovivo.usuarios.dto.Cuentas.*;
import com.sonidovivo.usuarios.model.Usuario;
import com.sonidovivo.usuarios.service.Usuarios;
import jakarta.validation.Valid;
import java.time.Instant;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final Usuarios usuarios;
    private final JwtEncoder encoder;

    public AuthController(Usuarios usuarios, JwtEncoder encoder) {
        this.usuarios = usuarios;
        this.encoder = encoder;
    }

    @PostMapping("/register") @ResponseStatus(HttpStatus.CREATED)
    public Sesion registrar(@Valid @RequestBody Registro r) {
        return sesion(usuarios.crear(new Edicion(r.nombre(), r.email(), r.password(), "cliente", true)));
    }

    @PostMapping("/login")
    public Sesion login(@Valid @RequestBody Login r) { return sesion(usuarios.autenticar(r)); }

    @GetMapping("/me")
    @io.swagger.v3.oas.annotations.security.SecurityRequirement(name="bearerAuth")
    public Vista perfil(@AuthenticationPrincipal Jwt jwt) {
        return Vista.de(usuarios.obtener(Long.parseLong(jwt.getSubject())));
    }

    private Sesion sesion(Usuario u) {
        Instant ahora = Instant.now();
        Instant fin = ahora.plusSeconds(1800);
        var claims = JwtClaimsSet.builder().subject(u.id.toString()).issuedAt(ahora).expiresAt(fin)
            .claim("rol", u.rol.nombre).claim("roles", List.of(u.rol.nombre)).claim("version", u.version).build();
        var header = JwsHeader.with(MacAlgorithm.HS256).build();
        String token = encoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();
        return new Sesion(token, fin.toEpochMilli(), Vista.de(u));
    }
}
