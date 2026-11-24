package com.sonidovivo.catalogo.controller;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import com.sonidovivo.catalogo.dto.*;
import com.sonidovivo.catalogo.service.CatalogoService;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;
@RestController @RequestMapping("/api/productos")
@SecurityRequirement(name = "bearerAuth")
public class ProductoController {
 private final CatalogoService service; public ProductoController(CatalogoService s){service=s;}
 @GetMapping public List<ProductoResponse> listar(@RequestParam(required=false) String busqueda,@RequestParam(required=false) Long categoriaId,@RequestParam(required=false) BigDecimal precioMin,@RequestParam(required=false) BigDecimal precioMax){return service.listar(busqueda,categoriaId,precioMin,precioMax);}
 @GetMapping("/{id}") public ProductoResponse obtener(@PathVariable Long id){return service.obtener(id);}
 @PostMapping @PreAuthorize("hasAnyRole('ADMIN','VENDEDOR')") public ResponseEntity<ProductoResponse> crear(@Valid @RequestBody ProductoRequest r){return ResponseEntity.status(HttpStatus.CREATED).body(service.crear(r));}
 @PutMapping("/{id}") @PreAuthorize("hasAnyRole('ADMIN','VENDEDOR')") public ProductoResponse actualizar(@PathVariable Long id,@Valid @RequestBody ProductoRequest r){return service.actualizar(id,r);}
 @DeleteMapping("/{id}") @PreAuthorize("hasAnyRole('ADMIN','VENDEDOR')") public ResponseEntity<Void> eliminar(@PathVariable Long id){service.eliminar(id);return ResponseEntity.noContent().build();}
 @PutMapping("/{id}/ajustar-stock") @PreAuthorize("hasAnyRole('ADMIN','VENDEDOR')")
 public ProductoResponse ajustar(@PathVariable Long id,@RequestBody java.util.Map<String,Integer> body){
  Integer delta=body.get("delta");
  if(delta==null)throw new com.sonidovivo.catalogo.exception.ReglaNegocioException("Debes informar delta");
  return service.ajustarStock(id,delta);
 }
 @PutMapping("/{id}/descontar-stock") @PreAuthorize("hasAnyRole('ADMIN','VENDEDOR')") public ProductoResponse descontar(@PathVariable Long id,@Valid @RequestBody DescontarStockRequest r){return service.descontar(id,r.cantidad());}
}
