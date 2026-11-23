-- Javier - ms-pedidos - Tienda Sonido Vivo (MySQL 8/MariaDB compatible)
-- Base separada en 3FN. No modifica 01_schema_usuarios ni 02_schema_catalogo.
CREATE DATABASE IF NOT EXISTS sonido_vivo_pedidos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sonido_vivo_pedidos;

CREATE TABLE IF NOT EXISTS pedidos (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    version BIGINT NOT NULL DEFAULT 0,
    folio VARCHAR(40) NOT NULL UNIQUE,
    cliente_id VARCHAR(150) NOT NULL COMMENT 'Valor sub del JWT (ms-usuarios-auth)',
    cliente_nombre VARCHAR(160) NOT NULL,
    cliente_correo VARCHAR(180) NOT NULL,
    cliente_telefono VARCHAR(30) NOT NULL,
    fecha_creacion DATETIME(6) NOT NULL,
    estado VARCHAR(30) NOT NULL COMMENT 'EN_PREPARACION, DESPACHADO, ENTREGADO',
    estado_stock VARCHAR(30) NOT NULL COMMENT 'PENDIENTE, CONFIRMADO, INCIDENCIA',
    total DECIMAL(15,2) NOT NULL,
    INDEX idx_pedidos_cliente_fecha (cliente_id, fecha_creacion),
    INDEX idx_pedidos_fecha (fecha_creacion),
    INDEX idx_pedidos_estado_stock (estado_stock)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS detalles_pedido (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    pedido_id BIGINT NOT NULL,
    producto_id BIGINT NOT NULL COMMENT 'ID del producto de ms-catalogo (sin FK entre bases)',
    codigo VARCHAR(50) NOT NULL,
    nombre VARCHAR(200) NOT NULL,
    precio_unitario DECIMAL(15,2) NOT NULL,
    cantidad INT NOT NULL,
    subtotal DECIMAL(15,2) NOT NULL,
    stock_descontado BIT(1) NOT NULL DEFAULT b'0',
    CONSTRAINT fk_detalle_pedido FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
    CONSTRAINT uq_detalle_producto UNIQUE (pedido_id, producto_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS envios (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    pedido_id BIGINT NOT NULL UNIQUE,
    modalidad VARCHAR(30) NOT NULL COMMENT 'RETIRO_TIENDA o DESPACHO_DOMICILIO',
    transportista VARCHAR(30) NULL COMMENT 'Starken o Chilexpress, NULL para retiro',
    direccion VARCHAR(250) NULL,
    comuna VARCHAR(120) NULL,
    region VARCHAR(120) NULL,
    codigo_seguimiento VARCHAR(100) NULL,
    CONSTRAINT fk_envio_pedido FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE
) ENGINE=InnoDB;
