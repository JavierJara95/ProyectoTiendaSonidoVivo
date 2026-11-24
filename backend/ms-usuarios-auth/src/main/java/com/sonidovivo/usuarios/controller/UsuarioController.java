package com.sonidovivo.usuarios.controller;

import com.sonidovivo.usuarios.dto.Cuentas.*;
import com.sonidovivo.usuarios.service.Usuarios;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios")
@SecurityRequirement(name="bearerAuth")
public class UsuarioController {
    private final Usuarios usuarios;
    public UsuarioController(Usuarios usuarios) { this.usuarios = usuarios; }

    @GetMapping
    public List<Vista> listar() { return usuarios.listar(); }

    @GetMapping("/{id}")
    public Vista obtener(@PathVariable long id) { return Vista.de(usuarios.obtener(id)); }

    @PostMapping @ResponseStatus(HttpStatus.CREATED)
    public Vista crear(@Valid @RequestBody Edicion datos) { return Vista.de(usuarios.crear(datos)); }

    @PutMapping("/{id}")
    public Vista editar(Principal actor, @PathVariable long id, @Valid @RequestBody Edicion datos) {
        return usuarios.editar(Long.parseLong(actor.getName()), id, datos);
    }

    @PatchMapping("/{id}/estado")
    public Vista estado(Principal actor, @PathVariable long id, @Valid @RequestBody Estado datos) {
        return usuarios.estado(Long.parseLong(actor.getName()), id, datos.activo());
    }

    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(Principal actor, @PathVariable long id) { usuarios.borrar(Long.parseLong(actor.getName()), id); }
}
