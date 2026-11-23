package com.sonidovivo.pedidos.controller;

import com.sonidovivo.pedidos.dto.PedidoResponse;
import com.sonidovivo.pedidos.service.PedidoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/seguimiento")
@SecurityRequirement(name = "bearerAuth")
public class SeguimientoController {
    private final PedidoService service;
    public SeguimientoController(PedidoService service) { this.service = service; }

    @GetMapping("/{folio}")
    @PreAuthorize("hasAnyRole('ADMIN','VENDEDOR','CLIENTE')")
    @Operation(summary = "Estado y tracking del pedido; un cliente solo puede consultar sus propios pedidos")
    public PedidoResponse porFolio(@PathVariable String folio, @AuthenticationPrincipal Jwt jwt) {
        return service.seguimiento(folio, jwt.getSubject(), PedidoController.esCliente(jwt));
    }
}
