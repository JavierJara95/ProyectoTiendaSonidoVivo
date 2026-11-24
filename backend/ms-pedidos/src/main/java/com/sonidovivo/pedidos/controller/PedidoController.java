package com.sonidovivo.pedidos.controller;

import com.sonidovivo.pedidos.dto.*;
import com.sonidovivo.pedidos.service.PedidoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import java.net.URI;
import java.time.LocalDate;
import java.util.List;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pedidos")
@SecurityRequirement(name = "bearerAuth")
public class PedidoController {
    private final PedidoService service;
    public PedidoController(PedidoService service) { this.service = service; }

    @PostMapping
    @PreAuthorize("hasAnyRole('CLIENTE','ADMIN')")
    @Operation(summary = "Crear pedido y descontar stock real de ms-catalogo")
    public ResponseEntity<PedidoResponse> crear(@AuthenticationPrincipal Jwt jwt, @Valid @RequestBody CrearPedidoRequest request) {
        PedidoResponse r = service.crear(jwt.getSubject(), request);
        return ResponseEntity.created(URI.create("/api/pedidos/" + r.id())).body(r);
    }

    @GetMapping("/mis-pedidos")
    @PreAuthorize("hasAnyRole('CLIENTE','ADMIN')")
    @Operation(summary = "Historial privado del cliente autenticado (sub del JWT)")
    public List<PedidoResponse> misPedidos(@AuthenticationPrincipal Jwt jwt) {
        return service.misPedidos(jwt.getSubject());
    }

    @GetMapping("/resumen")
    @PreAuthorize("hasAnyRole('ADMIN','VENDEDOR')")
    @Operation(summary = "Resumen de pedidos confirmados (no certifica pagos recibidos)")
    public ResumenPedidosResponse resumen(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate desde,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate hasta) {
        return service.resumen(desde, hasta);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','VENDEDOR')")
    @Operation(summary = "Listado global, incluidos pedidos con incidencias de stock")
    public List<PedidoResponse> listar() { return service.listar(); }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','VENDEDOR','CLIENTE')")
    public PedidoResponse obtener(@PathVariable Long id, @AuthenticationPrincipal Jwt jwt) {
        return service.detalle(id, jwt.getSubject(), esCliente(jwt));
    }

    @PutMapping("/{id}/estado")
    @PreAuthorize("hasAnyRole('ADMIN','VENDEDOR')")
    @Operation(summary = "Despachar (con seguimiento), entregar o confirmar retiro")
    public PedidoResponse cambiarEstado(@PathVariable Long id, @Valid @RequestBody CambiarEstadoRequest request) {
        return service.actualizar(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Solo elimina incidencias sin unidades de stock descontadas; pedidos válidos no se borran")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        service.eliminarIncidencia(id);
        return ResponseEntity.noContent().build();
    }

    static boolean esCliente(Jwt jwt) {
        String rol = jwt.getClaimAsString("rol");
        if (rol == null) rol = jwt.getClaimAsString("role");
        return rol != null && (rol.equalsIgnoreCase("CLIENTE") || rol.equalsIgnoreCase("ROLE_CLIENTE"));
    }
}
