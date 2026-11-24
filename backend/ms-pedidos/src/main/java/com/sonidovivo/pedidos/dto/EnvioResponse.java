package com.sonidovivo.pedidos.dto;

import com.sonidovivo.pedidos.model.*;

public record EnvioResponse(ModalidadEntrega modalidad, String tipo, String transportista, String direccion, String comuna,
                            String region, String numeroSeguimiento) {
    public static EnvioResponse from(Envio e) {
        return new EnvioResponse(e.getModalidad(),
                e.getModalidad() == ModalidadEntrega.RETIRO_TIENDA ? "Retiro en tienda" : "Despacho a domicilio",
                e.getTransportista(), e.getDireccion(), e.getComuna(), e.getRegion(), e.getCodigoSeguimiento());
    }
}
