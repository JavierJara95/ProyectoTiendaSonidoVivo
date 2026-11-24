package com.sonidovivo.usuarios;

import com.jayway.jsonpath.JsonPath;
import java.net.URI;
import java.net.http.*;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.ActiveProfiles;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment=SpringBootTest.WebEnvironment.RANDOM_PORT, properties={
    "app.jwt-secret=clave-exclusiva-de-la-prueba-de-integracion",
    "ADMIN_PASSWORD=AdminPrueba123"
})
@ActiveProfiles("prueba")
class SeguridadTest {
    @LocalServerPort int port;
    private final HttpClient http = HttpClient.newHttpClient();

    private String enviar(String metodo, String ruta, String token, String json, int esperado) throws Exception {
        var b = HttpRequest.newBuilder(URI.create("http://localhost:" + port + ruta));
        if (token != null) b.header("Authorization", "Bearer " + token);
        if (json != null) b.header("Content-Type", "application/json");
        var datos = json == null ? HttpRequest.BodyPublishers.noBody() : HttpRequest.BodyPublishers.ofString(json);
        var respuesta = http.send(b.method(metodo, datos).build(), HttpResponse.BodyHandlers.ofString());
        assertEquals(esperado, respuesta.statusCode(), metodo + " " + ruta);
        return respuesta.body();
    }

    private String token(String respuesta, String esperado) throws Exception {
        String valor = JsonPath.read(respuesta, "$.token");
        var claims = com.nimbusds.jwt.SignedJWT.parse(valor).getJWTClaimsSet();
        assertEquals(esperado, claims.getStringClaim("rol"));
        assertEquals(List.of(esperado), claims.getStringListClaim("roles"));
        assertTrue(claims.getExpirationTime().after(claims.getIssueTime()));
        return valor;
    }

    @Test void flujoDeRolesYAdministracion() throws Exception {
        String usuarios = "/api/usuarios";
        String login = "/api/auth/login";
        String clienteDatos = """
            {"nombre":"Cliente","email":"cliente@test.cl","password":"Cliente123","rol":"admin"}
            """;
        String admin = token(enviar("POST", login, null,
            "{\"email\":\"admin@sonidovivo.cl\",\"password\":\"AdminPrueba123\"}", 200), "ROLE_ADMIN");
        String cliente = token(enviar("POST", "/api/auth/register", null, clienteDatos, 201), "ROLE_CLIENTE");
        enviar("GET", "/api/auth/me", cliente, null, 200);
        enviar("GET", usuarios, null, null, 401);
        enviar("GET", usuarios, cliente, null, 403);
        enviar("GET", usuarios, admin, null, 200);
        String vendedorDatos = """
            {"nombre":"Vendedor","email":"ventas@test.cl","password":"Ventas123","rol":"vendedor"}
            """;
        String creado = enviar("POST", usuarios, admin, vendedorDatos, 201);
        assertFalse(creado.contains("password"));
        String ruta = usuarios + "/" + JsonPath.read(creado, "$.id").toString();
        String credenciales = "{\"email\":\"ventas@test.cl\",\"password\":\"Ventas123\"}";
        String vendedor = token(enviar("POST", login, null, credenciales, 200), "ROLE_VENDEDOR");
        enviar("GET", usuarios, vendedor, null, 403);
        enviar("GET", ruta, admin, null, 200);
        enviar("POST", usuarios, admin, vendedorDatos, 409);
        enviar("PUT", ruta, admin, vendedorDatos.replace("vendedor", "cliente"), 200);
        enviar("GET", "/api/auth/me", vendedor, null, 401);
        String nuevo = token(enviar("POST", login, null, credenciales, 200), "ROLE_CLIENTE");
        enviar("PATCH", ruta + "/estado", admin, "{\"activo\":false}", 200);
        enviar("GET", "/api/auth/me", nuevo, null, 401);
        enviar("POST", login, null, credenciales, 401);
        enviar("PATCH", ruta + "/estado", admin, "{\"activo\":true}", 200);
        enviar("POST", login, null, credenciales, 200);
        enviar("DELETE", ruta, admin, null, 204);
        enviar("GET", ruta, admin, null, 404);
        enviar("GET", "/v3/api-docs", null, null, 200);
    }
}
