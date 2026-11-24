package com.sonidovivo.pedidos.service;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jwt.*;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/** Token efímero exclusivamente entre servidores; nunca se entrega al navegador. */
@Component
public class TokenServicio {
    private final byte[] secreto;
    public TokenServicio(@Value("${app.security.jwt-secret:}") String secreto) {
        this.secreto = secreto.getBytes(StandardCharsets.UTF_8);
        if (this.secreto.length < 32) throw new IllegalStateException("JWT_SECRET debe tener al menos 32 bytes");
    }
    public String tokenCatalogo() {
        Instant ahora = Instant.now();
        SignedJWT jwt = new SignedJWT(new JWSHeader(JWSAlgorithm.HS256),
                new JWTClaimsSet.Builder().subject("ms-pedidos-service").issueTime(Date.from(ahora))
                        .expirationTime(Date.from(ahora.plusSeconds(60))).claim("rol", "VENDEDOR").build());
        try {
            jwt.sign(new MACSigner(secreto));
            return jwt.serialize();
        } catch (JOSEException e) {
            throw new IllegalStateException("No se pudo firmar JWT de servicio", e);
        }
    }
}
