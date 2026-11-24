package com.sonidovivo.pedidos.service;

import com.sonidovivo.pedidos.dto.ProductoCatalogoResponse;
import com.sonidovivo.pedidos.exception.*;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Component;
import org.springframework.web.client.*;
import java.util.Arrays;
import java.util.List;

/** Solo utiliza endpoints disponibles en el ms-catalogo original de Valentina. */
@Component
public class CatalogoClient {
    private final RestClient client;
    private final TokenServicio tokenServicio;
    public CatalogoClient(RestClient catalogoRestClient, TokenServicio tokenServicio) {
        this.client = catalogoRestClient;
        this.tokenServicio = tokenServicio;
    }
    public ProductoCatalogoResponse obtener(Long id) {
        try {
            ProductoCatalogoResponse p = client.get().uri("/api/productos/{id}", id)
                    .headers(h -> h.setBearerAuth(tokenServicio.tokenCatalogo()))
                    .retrieve().body(ProductoCatalogoResponse.class);
            if (p == null) throw new IntegracionCatalogoException("Catálogo devolvió un producto vacío", false);
            return p;
        } catch (RestClientResponseException e) { throw mapear(e, "consultar producto " + id); }
          catch (ResourceAccessException e) { throw sinConexion(); }
    }
    public List<ProductoCatalogoResponse> listar() {
        try {
            ProductoCatalogoResponse[] data = client.get().uri("/api/productos")
                    .headers(h -> h.setBearerAuth(tokenServicio.tokenCatalogo()))
                    .retrieve().body(ProductoCatalogoResponse[].class);
            if (data == null) throw new IntegracionCatalogoException("Catálogo devolvió una lista vacía", false);
            return Arrays.asList(data);
        } catch (RestClientResponseException e) { throw mapear(e, "listar productos"); }
          catch (ResourceAccessException e) { throw sinConexion(); }
    }
    public void descontarStock(Long productoId, int cantidad) {
        try {
            client.put().uri("/api/productos/{id}/descontar-stock", productoId)
                    .headers(h -> h.setBearerAuth(tokenServicio.tokenCatalogo()))
                    .body(java.util.Map.of("cantidad", cantidad))
                    .retrieve().toBodilessEntity();
        } catch (RestClientResponseException e) { throw mapear(e, "descontar stock del producto " + productoId); }
          catch (ResourceAccessException e) { throw sinConexion(); }
    }
    /** Compensación best effort cuando una compra multiítem falla tras descuentos previos. */
    public void reponerStock(Long productoId, int cantidad) {
        try {
            client.put().uri("/api/productos/{id}/ajustar-stock", productoId)
                    .headers(h -> h.setBearerAuth(tokenServicio.tokenCatalogo()))
                    .body(java.util.Map.of("delta", cantidad))
                    .retrieve().toBodilessEntity();
        } catch (RestClientResponseException e) { throw mapear(e, "reponer stock del producto " + productoId); }
          catch (ResourceAccessException e) { throw sinConexion(); }
    }
    private IntegracionCatalogoException mapear(RestClientResponseException e, String operacion) {
        int status = e.getStatusCode().value();
        return new IntegracionCatalogoException("Catálogo rechazó " + operacion + " (HTTP " + status + ")",
                status == 400 || status == 404 || status == 409);
    }
    private IntegracionCatalogoException sinConexion() {
        return new IntegracionCatalogoException("No se puede contactar a ms-catalogo en el puerto 8081", false);
    }
}
