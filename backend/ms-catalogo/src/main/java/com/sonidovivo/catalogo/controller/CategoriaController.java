package com.sonidovivo.catalogo.controller;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import com.sonidovivo.catalogo.dto.*;import com.sonidovivo.catalogo.service.CatalogoService;
import jakarta.validation.Valid;import org.springframework.http.*;import org.springframework.security.access.prepost.PreAuthorize;import org.springframework.web.bind.annotation.*;import java.util.List;
@RestController @RequestMapping("/api/categorias")
@SecurityRequirement(name = "bearerAuth")
public class CategoriaController {
 private final CatalogoService service;public CategoriaController(CatalogoService s){service=s;}
 @GetMapping public List<CategoriaResponse> listar(){return service.listarCategorias();}
 @PostMapping @PreAuthorize("hasAnyRole('ADMIN','VENDEDOR')") public ResponseEntity<CategoriaResponse> crear(@Valid @RequestBody CategoriaRequest r){return ResponseEntity.status(HttpStatus.CREATED).body(service.crearCategoria(r));}
 @PutMapping("/{id}") @PreAuthorize("hasAnyRole('ADMIN','VENDEDOR')") public CategoriaResponse actualizar(@PathVariable Long id,@Valid @RequestBody CategoriaRequest r){return service.actualizarCategoria(id,r);}
 @DeleteMapping("/{id}") @PreAuthorize("hasAnyRole('ADMIN','VENDEDOR')") public ResponseEntity<Void> eliminar(@PathVariable Long id){service.eliminarCategoria(id);return ResponseEntity.noContent().build();}
}
