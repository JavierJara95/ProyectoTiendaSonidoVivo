package com.sonidovivo.pedidos.repository;

import com.sonidovivo.pedidos.model.Pedido;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    @EntityGraph(attributePaths = {"detalles", "envio"})
    Optional<Pedido> findByFolio(String folio);
    @Override @EntityGraph(attributePaths = {"detalles", "envio"})
    Optional<Pedido> findById(Long id);
    @EntityGraph(attributePaths = {"detalles", "envio"})
    List<Pedido> findByClienteIdOrderByFechaCreacionDesc(String clienteId);
    @EntityGraph(attributePaths = {"detalles", "envio"})
    List<Pedido> findAllByOrderByFechaCreacionDesc();
    @EntityGraph(attributePaths = {"detalles", "envio"})
    List<Pedido> findByFechaCreacionGreaterThanEqualAndFechaCreacionLessThanOrderByFechaCreacionDesc(LocalDateTime desde, LocalDateTime hasta);
}
