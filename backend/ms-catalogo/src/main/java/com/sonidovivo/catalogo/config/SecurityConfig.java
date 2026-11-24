package com.sonidovivo.catalogo.config;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.*;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.security.oauth2.server.resource.authentication.*;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.*;
@Configuration @EnableMethodSecurity
public class SecurityConfig {
 @Value("${app.security.jwt-secret:}") private String jwtSecret;
 @Bean SecurityFilterChain securityFilterChain(HttpSecurity http)throws Exception{
  http.csrf(csrf->csrf.disable()).cors(Customizer.withDefaults()).authorizeHttpRequests(a->a
   .requestMatchers("/swagger-ui.html","/swagger-ui/**","/v3/api-docs/**").permitAll()
   .requestMatchers(HttpMethod.OPTIONS,"/**").permitAll()
   .anyRequest().authenticated()).oauth2ResourceServer(o->o.jwt(j->j.jwtAuthenticationConverter(jwtAuthenticationConverter())));
  return http.build();
 }
 @Bean JwtDecoder jwtDecoder(){
  if(jwtSecret==null||jwtSecret.length()<32) throw new IllegalStateException("Configura JWT_SECRET con al menos 32 caracteres y comparte el mismo secreto con ms-usuarios-auth");
  return NimbusJwtDecoder.withSecretKey(new SecretKeySpec(jwtSecret.getBytes(StandardCharsets.UTF_8),"HmacSHA256")).macAlgorithm(MacAlgorithm.HS256).build();
 }
 @Bean JwtAuthenticationConverter jwtAuthenticationConverter(){JwtGrantedAuthoritiesConverter unused=new JwtGrantedAuthoritiesConverter();JwtAuthenticationConverter c=new JwtAuthenticationConverter();c.setJwtGrantedAuthoritiesConverter(jwt->{String role=jwt.getClaimAsString("rol");if(role==null)role=jwt.getClaimAsString("role");if(role==null)return List.of();role=role.toUpperCase(Locale.ROOT);if(role.startsWith("ROLE_"))role=role.substring(5);return List.of(new SimpleGrantedAuthority("ROLE_"+role));});return c;}
 @Bean CorsConfigurationSource corsConfigurationSource(){CorsConfiguration c=new CorsConfiguration();c.setAllowedOrigins(List.of("http://localhost:5173", "http://127.0.0.1:5173"));c.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS"));c.setAllowedHeaders(List.of("Authorization","Content-Type"));c.setExposedHeaders(List.of("Location"));UrlBasedCorsConfigurationSource s=new UrlBasedCorsConfigurationSource();s.registerCorsConfiguration("/**",c);return s;}
}
