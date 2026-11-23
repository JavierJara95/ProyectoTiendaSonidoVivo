package com.sonidovivo.catalogo.config;
import io.swagger.v3.oas.models.OpenAPI;import io.swagger.v3.oas.models.info.Info;import io.swagger.v3.oas.models.Components;import io.swagger.v3.oas.models.security.SecurityScheme;import org.springframework.context.annotation.Bean;import org.springframework.context.annotation.Configuration;
@Configuration public class OpenApiConfig {
 @Bean public OpenAPI catalogoOpenAPI(){return new OpenAPI().info(new Info().title("Microservicio Catálogo - Sonido Vivo").version("1.0.0").description("API REST de productos, categorías e inventario")).components(new Components().addSecuritySchemes("bearerAuth",new SecurityScheme().type(SecurityScheme.Type.HTTP).scheme("bearer").bearerFormat("JWT")));}
}
