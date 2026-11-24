package com.sonidovivo.pedidos.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.*;

@Configuration
public class OpenApiConfig {
    @Bean OpenAPI pedidosApi() {
        return new OpenAPI().info(new Info().title("Sonido Vivo - API de Pedidos y Despachos")
                .version("1.0.0").description("Microservicio ms-pedidos (Javier): gestión de ventas, seguimiento y despacho"))
                .components(new Components().addSecuritySchemes("bearerAuth", new SecurityScheme()
                        .name("bearerAuth").type(SecurityScheme.Type.HTTP).scheme("bearer").bearerFormat("JWT")));
    }
}
