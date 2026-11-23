package com.sonidovivo.pedidos;

import com.sonidovivo.pedidos.dto.CambiarEstadoRequest;
import com.sonidovivo.pedidos.exception.ReglaNegocioException;
import com.sonidovivo.pedidos.model.*;
import com.sonidovivo.pedidos.repository.PedidoRepository;
import com.sonidovivo.pedidos.service.PedidoPersistenciaService;
import org.junit.jupiter.api.Test;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class PedidoPersistenciaServiceTest {
    private final PedidoRepository repo = mock(PedidoRepository.class);
    private final PedidoPersistenciaService servicio = new PedidoPersistenciaService(repo);

    private Pedido confirmado(ModalidadEntrega modalidad) {
        Pedido pedido = new Pedido();
        pedido.setEstadoStock(EstadoStock.CONFIRMADO);
        Envio envio = new Envio();
        envio.setModalidad(modalidad);
        pedido.asignarEnvio(envio);
        when(repo.findById(8L)).thenReturn(Optional.of(pedido));
        return pedido;
    }

    @Test void paraDespacharEsObligatorioCodigoSeguimiento() {
        confirmado(ModalidadEntrega.DESPACHO_DOMICILIO);
        assertThrows(ReglaNegocioException.class,
                () -> servicio.cambiarEstado(8L, new CambiarEstadoRequest(EstadoPedido.DESPACHADO, "")));
    }
    @Test void unDespachoPasaDePreparacionADespachadoYEntregado() {
        Pedido p = confirmado(ModalidadEntrega.DESPACHO_DOMICILIO);
        servicio.cambiarEstado(8L, new CambiarEstadoRequest(EstadoPedido.DESPACHADO, "TRACK-100"));
        assertEquals(EstadoPedido.DESPACHADO, p.getEstado());
        assertEquals("TRACK-100", p.getEnvio().getCodigoSeguimiento());
        servicio.cambiarEstado(8L, new CambiarEstadoRequest(EstadoPedido.ENTREGADO, null));
        assertEquals(EstadoPedido.ENTREGADO, p.getEstado());
        assertThrows(ReglaNegocioException.class,
                () -> servicio.cambiarEstado(8L, new CambiarEstadoRequest(EstadoPedido.DESPACHADO, null)));
    }
    @Test void retiroPuedePasarDirectoAEntregado() {
        Pedido p = confirmado(ModalidadEntrega.RETIRO_TIENDA);
        servicio.cambiarEstado(8L, new CambiarEstadoRequest(EstadoPedido.ENTREGADO, null));
        assertEquals(EstadoPedido.ENTREGADO, p.getEstado());
    }
    @Test void noEliminaPedidoQueYaDescontoStock() {
        Pedido p = new Pedido();
        p.setEstadoStock(EstadoStock.CONFIRMADO);
        when(repo.findById(8L)).thenReturn(Optional.of(p));
        assertThrows(ReglaNegocioException.class, () -> servicio.eliminarIncidenciaSinStock(8L));
        verify(repo, never()).delete(any());
    }
}
