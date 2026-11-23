package com.sonidovivo.pedidos;

import com.sonidovivo.pedidos.dto.*;
import com.sonidovivo.pedidos.exception.*;
import com.sonidovivo.pedidos.model.*;
import com.sonidovivo.pedidos.service.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import java.math.BigDecimal;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PedidoServiceTest {
    @Mock PedidoPersistenciaService persistencia;
    @Mock CatalogoClient catalogo;
    @InjectMocks PedidoService servicio;

    private CrearPedidoRequest request() {
        return new CrearPedidoRequest(
                new ClienteRequest("Cliente Ejemplo", "cliente@ejemplo.cl", "912345678"),
                List.of(new ItemPedidoRequest(7L, "GA001", 2)),
                new EntregaRequest("Despacho a domicilio", "Starken", "Av. Prueba 123", "Viña del Mar", "Valparaíso"));
    }
    private void catalogoDisponible() {
        when(catalogo.obtener(7L)).thenReturn(new ProductoCatalogoResponse(7L, "GA001", "Guitarra", new BigDecimal("129990"), 4));
    }
    @Test void crearPedidoCalculaTotalEnServidorYDescuentaStock() {
        catalogoDisponible();
        // El repositorio en esta prueba devuelve el mismo objeto registrado.
        final Pedido[] creado = new Pedido[1];
        // Stub específico que captura el estado de la entidad persistida.
        when(persistencia.guardarNuevo(any())).thenAnswer(inv -> {
            Pedido p = inv.getArgument(0);
            ReflectionTestUtils.setField(p, "id", 11L);
            creado[0] = p;
            return p;
        });
        doAnswer(inv -> { creado[0].getDetalles().get(0).setStockDescontado(true); return null; })
                .when(persistencia).marcarDescontado(11L, 7L);
        doAnswer(inv -> { creado[0].setEstadoStock(EstadoStock.CONFIRMADO); return null; })
                .when(persistencia).marcarConfirmado(11L);
        when(persistencia.buscar(11L)).thenAnswer(inv -> creado[0]);

        PedidoResponse resultado = servicio.crear("usr-42", request());
        assertEquals(new BigDecimal("259980"), resultado.total());
        assertEquals("usr-42", resultado.clienteId());
        assertEquals(EstadoStock.CONFIRMADO, resultado.estadoStock());
        assertEquals(EstadoPedido.EN_PREPARACION, resultado.estado());
        verify(catalogo).descontarStock(7L, 2);
    }

    @Test void noRegistraPedidoCuandoElStockEsInsuficiente() {
        when(catalogo.obtener(7L)).thenReturn(new ProductoCatalogoResponse(7L, "GA001", "Guitarra", new BigDecimal("10"), 1));
        assertThrows(ReglaNegocioException.class, () -> servicio.crear("usr-1", request()));
        verify(persistencia, never()).guardarNuevo(any());
        verify(catalogo, never()).descontarStock(anyLong(), anyInt());
    }

    @Test void dejaIncidenciaAnteFalloDeCatalogoLuegoDeGuardarPedido() {
        catalogoDisponible();
        when(persistencia.guardarNuevo(any())).thenAnswer(inv -> {
            Pedido p = inv.getArgument(0);
            ReflectionTestUtils.setField(p, "id", 11L);
            return p;
        });
        doThrow(new IntegracionCatalogoException("Sin stock", true)).when(catalogo).descontarStock(7L, 2);
        IncidenciaStockException error = assertThrows(IncidenciaStockException.class,
                () -> servicio.crear("usr-42", request()));
        assertTrue(error.isConflicto());
        assertTrue(error.getFolio().startsWith("SV-"));
        verify(persistencia).marcarIncidencia(11L);
    }

    @Test void clienteNoPuedeVerPedidoAjeno() {
        Pedido p = new Pedido();
        p.setClienteId("cliente-original");
        when(persistencia.buscar(3L)).thenReturn(p);
        assertThrows(org.springframework.security.access.AccessDeniedException.class,
                () -> servicio.detalle(3L, "otro-cliente", true));
    }

    @Test void noAceptaUnProductoDuplicadoEnElMismoPedido() {
        when(catalogo.obtener(7L)).thenReturn(new ProductoCatalogoResponse(7L, "GA001", "Guitarra", new BigDecimal("10"), 10));
        CrearPedidoRequest doble = new CrearPedidoRequest(request().cliente(),
                List.of(new ItemPedidoRequest(7L, "GA001", 1), new ItemPedidoRequest(7L, "GA001", 2)), request().entrega());
        assertThrows(ReglaNegocioException.class, () -> servicio.crear("usr-42", doble));
        verify(persistencia, never()).guardarNuevo(any());
    }
}
