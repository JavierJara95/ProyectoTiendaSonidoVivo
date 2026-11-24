package com.sonidovivo.pedidos.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.*;
import org.springframework.http.*;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.*;

@Configuration @EnableMethodSecurity
public class SecurityConfig {
    @Bean SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())
                .sessionManagement(s -> s.sessionCreationPolicy(org.springframework.security.config.http.SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(a -> a
                        .requestMatchers("/swagger-ui.html", "/swagger-ui/**", "/v3/api-docs/**").permitAll()
                        .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()
                        .anyRequest().authenticated())
                .oauth2ResourceServer(o -> o.jwt(j -> j.jwtAuthenticationConverter(jwtAuthenticationConverter()))
                        .authenticationEntryPoint((req, res, e) -> writeError(res, HttpStatus.UNAUTHORIZED, "JWT ausente, inválido o vencido")))
                .exceptionHandling(e -> e.accessDeniedHandler((req, res, ex) -> writeError(res, HttpStatus.FORBIDDEN, "Rol sin permisos para esta operación")));
        return http.build();
    }
    private void writeError(jakarta.servlet.http.HttpServletResponse res, HttpStatus status, String mensaje) throws java.io.IOException {
        res.setStatus(status.value());
        res.setContentType(MediaType.APPLICATION_JSON_VALUE);
        res.setCharacterEncoding(StandardCharsets.UTF_8.name());
        new ObjectMapper().writeValue(res.getWriter(), Map.of("estado", status.value(), "mensaje", mensaje));
    }
    @Bean JwtDecoder jwtDecoder(@Value("${app.security.jwt-secret:}") String jwtSecret) {
        if (jwtSecret.getBytes(StandardCharsets.UTF_8).length < 32)
            throw new IllegalStateException("JWT_SECRET debe contener al menos 32 bytes y coincidir con ms-catalogo y ms-usuarios-auth");
        return NimbusJwtDecoder.withSecretKey(new SecretKeySpec(jwtSecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"))
                .macAlgorithm(MacAlgorithm.HS256).build();
    }
    @Bean JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(jwt -> {
            String rol = jwt.getClaimAsString("rol");
            if (rol == null) rol = jwt.getClaimAsString("role");
            if (rol == null) return List.of();
            rol = rol.toUpperCase(Locale.ROOT);
            if (rol.startsWith("ROLE_")) rol = rol.substring(5);
            if (!Set.of("CLIENTE", "VENDEDOR", "ADMIN").contains(rol)) return List.of();
            return List.of(new SimpleGrantedAuthority("ROLE_" + rol));
        });
        return converter;
    }
    @Bean CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173", "http://127.0.0.1:5173"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        config.setExposedHeaders(List.of("Location"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
