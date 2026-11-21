package com.sonidovivo.catalogo.service;
import com.sonidovivo.catalogo.dto.*;
import com.sonidovivo.catalogo.exception.*;
import com.sonidovivo.catalogo.model.*;
import com.sonidovivo.catalogo.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;
@Service
public class CatalogoService {
 private final ProductoRepository productos; private final CategoriaRepository categorias; private final MarcaRepository marcas;
 public CatalogoService(ProductoRepository p,CategoriaRepository c,MarcaRepository m){productos=p;categorias=c;marcas=m;}
 @Transactional(readOnly=true) public List<ProductoResponse> listar(String q,Long categoriaId,BigDecimal min,BigDecimal max){if(min!=null&&max!=null&&min.compareTo(max)>0)throw new ReglaNegocioException("El precio mínimo no puede superar el máximo");return productos.buscar(normalizar(q),categoriaId,min,max).stream().map(ProductoResponse::from).toList();}
 @Transactional(readOnly=true) public ProductoResponse obtener(Long id){return ProductoResponse.from(productos.findById(id).orElseThrow(()->new RecursoNoEncontradoException("Producto no encontrado: "+id)));}
 @Transactional public ProductoResponse crear(ProductoRequest r){if(productos.existsByCodigoIgnoreCase(r.codigo()))throw new ReglaNegocioException("Ya existe un producto con el código "+r.codigo());Producto p=new Producto();aplicar(p,r);return ProductoResponse.from(productos.save(p));}
 @Transactional public ProductoResponse actualizar(Long id,ProductoRequest r){Producto p=productos.findById(id).orElseThrow(()->new RecursoNoEncontradoException("Producto no encontrado: "+id));if(productos.existsByCodigoIgnoreCase(r.codigo())&&!p.getCodigo().equalsIgnoreCase(r.codigo()))throw new ReglaNegocioException("Ya existe un producto con el código "+r.codigo());aplicar(p,r);return ProductoResponse.from(p);}
 private void aplicar(Producto p,ProductoRequest r){p.setCodigo(r.codigo().trim());p.setNombre(r.nombre().trim());p.setModelo(r.modelo().trim());p.setDescripcion(r.descripcion());p.setPrecio(r.precio());p.setStock(r.stock());p.setCategoria(categorias.findById(r.categoriaId()).orElseThrow(()->new RecursoNoEncontradoException("Categoría no encontrada: "+r.categoriaId())));p.setMarca(marcas.findById(r.marcaId()).orElseThrow(()->new RecursoNoEncontradoException("Marca no encontrada: "+r.marcaId())));}
 @Transactional public void eliminar(Long id){if(!productos.existsById(id))throw new RecursoNoEncontradoException("Producto no encontrado: "+id);productos.deleteById(id);}
 @Transactional public ProductoResponse descontar(Long id,int cantidad){Producto p=productos.buscarPorIdConBloqueo(id).orElseThrow(()->new RecursoNoEncontradoException("Producto no encontrado: "+id));if(cantidad<1)throw new ReglaNegocioException("La cantidad debe ser mayor que cero");if(p.getStock()<cantidad)throw new ReglaNegocioException("Stock insuficiente. Disponible: "+p.getStock());p.setStock(p.getStock()-cantidad);return ProductoResponse.from(p);}
 @Transactional(readOnly=true) public List<CategoriaResponse> listarCategorias(){return categorias.findAll().stream().map(CategoriaResponse::from).toList();}
 @Transactional public CategoriaResponse crearCategoria(CategoriaRequest r){if(categorias.existsByNombreIgnoreCase(r.nombre().trim()))throw new ReglaNegocioException("La categoría ya existe");return CategoriaResponse.from(categorias.save(new Categoria(r.nombre().trim(),r.descripcion())));}
 @Transactional public CategoriaResponse actualizarCategoria(Long id,CategoriaRequest r){Categoria c=categorias.findById(id).orElseThrow(()->new RecursoNoEncontradoException("Categoría no encontrada: "+id));if(categorias.existsByNombreIgnoreCase(r.nombre().trim())&&!c.getNombre().equalsIgnoreCase(r.nombre().trim()))throw new ReglaNegocioException("La categoría ya existe");c.setNombre(r.nombre().trim());c.setDescripcion(r.descripcion());return CategoriaResponse.from(c);}
 @Transactional public void eliminarCategoria(Long id){if(!categorias.existsById(id))throw new RecursoNoEncontradoException("Categoría no encontrada: "+id);categorias.deleteById(id);}
 private String normalizar(String q){return q==null||q.isBlank()?null:q.trim();}
}
