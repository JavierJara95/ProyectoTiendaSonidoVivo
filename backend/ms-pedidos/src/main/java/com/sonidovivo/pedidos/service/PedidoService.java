package com.sonidovivo.pedidos.service;

import com.sonidovivo.pedidos.dto.*;
import com.sonidovivo.pedidos.exception.*;
import com.sonidovivo.pedidos.model.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.*;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class PedidoService {
    private static final ZoneId ZONA = ZoneId.of("America/Santiago");
    private final PedidoPersistenciaService persistencia;
    private final CatalogoClient catalogo;

    public PedidoService(PedidoPersistenciaService persistencia, CatalogoClient catalogo) {
        this.persistencia = persistencia;
        this.catalogo = catalogo;
    }

    public PedidoResponse crear(String clienteId, CrearPedidoRequest request) {
        if (clienteId == null || clienteId.isBlank()) throw new ReglaNegocioException("JWT sin identificador de cliente (sub)");
        if (request == null || request.cliente() == null || request.entrega() == null || request.items() == null || request.items().isEmpty())
            throw new ReglaNegocioException("Debes informar cliente, entrega y productos");
        ModalidadEntrega modalidad = validarModalidad(request.entrega());
        Pedido pedido = new Pedido();
        pedido.setFolio("SV-" + UUID.randomUUID().toString().replace("-", "").substring(0, 16).toUpperCase(Locale.ROOT));
        pedido.setClienteId(clienteId);
        pedido.setClienteNombre(request.cliente().nombre().trim());
        pedido.setClienteCorreo(request.cliente().correo().trim().toLowerCase(Locale.ROOT));
        pedido.setClienteTelefono(request.cliente().telefono().trim());
        pedido.setFechaCreacion(LocalDateTime.now(ZONA));
        Envio envio = new Envio();
        envio.setModalidad(modalidad);
        if (modalidad == ModalidadEntrega.DESPACHO_DOMICILIO) {
            envio.setTransportista(request.entrega().transportista().trim());
            envio.setDireccion(request.entrega().direccion().trim());
            envio.setComuna(request.entrega().comuna().trim());
            envio.setRegion(request.entrega().region().trim());
        }
        pedido.asignarEnvio(envio);

        // El navegador nunca determina precio, nombre ni stock: todo se consulta al catálogo.
        boolean requiereBuscarCodigo = request.items().stream().anyMatch(i -> i != null && i.productoId() == null);
        Map<String, ProductoCatalogoResponse> porCodigo = requiereBuscarCodigo
                ? catalogo.listar().stream().collect(Collectors.toMap(p -> p.codigo().toUpperCase(Locale.ROOT), Function.identity(), (a,b) -> a))
                : Map.of();
        Set<Long> ids = new HashSet<>();
        BigDecimal total = BigDecimal.ZERO;
        for (ItemPedidoRequest item : request.items()) {
            if (item == null || item.cantidad() == null || item.cantidad() < 1)
                throw new ReglaNegocioException("Cantidad inválida en el pedido");
            if (item.productoId() == null && (item.codigo() == null || item.codigo().isBlank()))
                throw new ReglaNegocioException("Cada ítem necesita productoId o codigo");
            ProductoCatalogoResponse producto = item.productoId() != null ? catalogo.obtener(item.productoId())
                    : porCodigo.get(item.codigo().trim().toUpperCase(Locale.ROOT));
            if (producto == null) throw new RecursoNoEncontradoException("Producto no encontrado: " + item.codigo());
            if (item.codigo() != null && !item.codigo().isBlank() && !producto.codigo().equalsIgnoreCase(item.codigo().trim()))
                throw new ReglaNegocioException("El ID y código del producto no corresponden");
            if (!ids.add(producto.id())) throw new ReglaNegocioException("Producto repetido en carrito: " + producto.codigo());
            if (producto.precio() == null || producto.precio().signum() < 0 || producto.stock() == null || producto.stock() < item.cantidad())
                throw new ReglaNegocioException("Stock o precio no válido para " + producto.codigo());
            DetallePedido d = new DetallePedido();
            d.setProductoId(producto.id());
            d.setCodigo(producto.codigo());
            d.setNombre(producto.nombre());
            d.setPrecioUnitario(producto.precio());
            d.setCantidad(item.cantidad());
            d.setSubtotal(producto.precio().multiply(BigDecimal.valueOf(item.cantidad())));
            total = total.add(d.getSubtotal());
            pedido.agregarDetalle(d);
        }
        pedido.setTotal(total);
        // Se registra primero como PENDIENTE. Ante fallo parcial queda INCIDENCIA en BD
        // y es obligatorio conciliar, porque HTTP no participa en la transacción MySQL.
        Pedido guardado = persistencia.guardarNuevo(pedido);
        for (DetallePedido detalle : guardado.getDetalles()) {
            try {
                catalogo.descontarStock(detalle.getProductoId(), detalle.getCantidad());
                persistencia.marcarDescontado(guardado.getId(), detalle.getProductoId());
            } catch (IntegracionCatalogoException e) {
                persistencia.marcarIncidencia(guardado.getId());
                throw new IncidenciaStockException(guardado.getFolio(), e.isConflicto());
            } catch (RuntimeException e) {
                persistencia.marcarIncidencia(guardado.getId());
                throw new IncidenciaStockException(guardado.getFolio(), false);
            }
        }
        persistencia.marcarConfirmado(guardado.getId());
        return PedidoResponse.from(persistencia.buscar(guardado.getId()));
    }

    public PedidoResponse detalle(Long id, String requesterId, boolean personal) {
        Pedido p = persistencia.buscar(id);
        autorizar(p, requesterId, personal);
        return PedidoResponse.from(p);
    }
    public PedidoResponse seguimiento(String folio, String requesterId, boolean personal) {
        Pedido p = persistencia.buscarFolio(folio.trim().toUpperCase(Locale.ROOT));
        autorizar(p, requesterId, personal);
        return PedidoResponse.from(p);
    }
    public List<PedidoResponse> misPedidos(String clienteId) {
        return persistencia.porCliente(clienteId).stream().map(PedidoResponse::from).toList();
    }
    public List<PedidoResponse> listar() {
        return persistencia.todos().stream().map(PedidoResponse::from).toList();
    }
    public PedidoResponse actualizar(Long id, CambiarEstadoRequest request) {
        return PedidoResponse.from(persistencia.cambiarEstado(id, request));
    }
    public void eliminarIncidencia(Long id) { persistencia.eliminarIncidenciaSinStock(id); }

    public ResumenPedidosResponse resumen(LocalDate desde, LocalDate hasta) {
        LocalDate inicio = desde == null ? LocalDate.now(ZONA).minusDays(30) : desde;
        LocalDate fin = hasta == null ? LocalDate.now(ZONA) : hasta;
        if (inicio.isAfter(fin)) throw new ReglaNegocioException("La fecha desde no puede superar hasta");
        List<Pedido> pedidos = persistencia.entreFechas(inicio.atStartOfDay(), fin.plusDays(1).atStartOfDay());
        List<Pedido> confirmados = pedidos.stream().filter(p -> p.getEstadoStock() == EstadoStock.CONFIRMADO).toList();
        return new ResumenPedidosResponse(inicio, fin, confirmados.size(),
                confirmados.stream().filter(p -> p.getEstado() == EstadoPedido.EN_PREPARACION).count(),
                confirmados.stream().filter(p -> p.getEstado() == EstadoPedido.DESPACHADO).count(),
                confirmados.stream().filter(p -> p.getEstado() == EstadoPedido.ENTREGADO).count(),
                pedidos.stream().filter(p -> p.getEstadoStock() == EstadoStock.INCIDENCIA).count(),
                confirmados.stream().map(Pedido::getTotal).reduce(BigDecimal.ZERO, BigDecimal::add));
    }

    private ModalidadEntrega validarModalidad(EntregaRequest entrega) {
        String tipo = entrega.tipo().trim().toLowerCase(Locale.ROOT);
        if (tipo.equals("retiro_tienda") || tipo.equals("retiro en tienda"))
            return ModalidadEntrega.RETIRO_TIENDA;
        if (!tipo.equals("despacho_domicilio") && !tipo.equals("despacho a domicilio"))
            throw new ReglaNegocioException("Tipo de entrega inválido: usa Retiro en tienda o Despacho a domicilio");
        if (!Set.of("Starken", "Chilexpress").contains(entrega.transportista()))
            throw new ReglaNegocioException("Solo se permite Starken o Chilexpress");
        if (blanco(entrega.direccion()) || blanco(entrega.comuna()) || blanco(entrega.region()))
            throw new ReglaNegocioException("Dirección, comuna y región son obligatorias para despacho");
        return ModalidadEntrega.DESPACHO_DOMICILIO;
    }
    private boolean blanco(String s) { return s == null || s.isBlank(); }
    private void autorizar(Pedido p, String requesterId, boolean personal) {
        if (personal && !p.getClienteId().equals(requesterId))
            throw new AccessDeniedException("No tienes acceso a pedidos de otro cliente");
    }
}
