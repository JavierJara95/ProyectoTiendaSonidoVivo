package com.sonidovivo.catalogo;
import com.sonidovivo.catalogo.dto.*;import com.sonidovivo.catalogo.exception.ReglaNegocioException;import com.sonidovivo.catalogo.model.*;import com.sonidovivo.catalogo.repository.*;import com.sonidovivo.catalogo.service.CatalogoService;
import org.junit.jupiter.api.*;import org.mockito.*;import java.math.BigDecimal;import java.util.*;
import static org.junit.jupiter.api.Assertions.*;import static org.mockito.Mockito.*;
class CatalogoServiceTest {
 @Mock ProductoRepository productos;@Mock CategoriaRepository categorias;@Mock MarcaRepository marcas;@InjectMocks CatalogoService service;
 @BeforeEach void init(){MockitoAnnotations.openMocks(this);}
 @Test void rechazaDescuentoCuandoStockEsInsuficiente(){Producto p=new Producto();p.setStock(2);when(productos.buscarPorIdConBloqueo(1L)).thenReturn(Optional.of(p));assertThrows(ReglaNegocioException.class,()->service.descontar(1L,3));verify(productos).buscarPorIdConBloqueo(1L);}
 @Test void descuentaStockCuandoHayDisponibilidad(){Producto p=mock(Producto.class);when(productos.buscarPorIdConBloqueo(1L)).thenReturn(Optional.of(p));when(p.getStock()).thenReturn(5);when(p.getId()).thenReturn(1L);Categoria c=new Categoria("Cuerdas","");Marca m=new Marca("Yamaha");when(p.getCategoria()).thenReturn(c);when(p.getMarca()).thenReturn(m);when(p.getCodigo()).thenReturn("X1");when(p.getNombre()).thenReturn("Guitarra");when(p.getModelo()).thenReturn("F310");when(p.getPrecio()).thenReturn(new BigDecimal("100"));when(p.getDescripcion()).thenReturn("");service.descontar(1L,2);verify(p).setStock(3);}
}
