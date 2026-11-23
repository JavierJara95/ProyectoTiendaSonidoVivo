package com.sonidovivo.pedidos.config;

import com.sonidovivo.pedidos.service.TokenServicio;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.*;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestClient;
import java.time.Duration;

@Configuration
public class CatalogoConfig {
    @Bean RestClient catalogoRestClient(@Value("${app.catalogo.url}") String url) {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(Duration.ofSeconds(3));
        factory.setReadTimeout(Duration.ofSeconds(5));
        return RestClient.builder().baseUrl(url).requestFactory(factory).build();
    }
}
