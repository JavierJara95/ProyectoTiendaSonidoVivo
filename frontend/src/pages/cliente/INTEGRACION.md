# Integración del módulo cliente

El módulo puede montarse en el router común con `ClienteModule.jsx` desde una ruta `/cliente/*`. No debe importarse otro `BrowserRouter`: el router global del proyecto conserva esa responsabilidad.

```jsx
import ClienteModule from '../pages/cliente/ClienteModule.jsx';

<Route path="cliente/*" element={<ClienteModule />} />
```

La navegación usa `rutasCliente.js` para generar URLs bajo `/cliente` cuando se monta en esa sección y URLs de raíz cuando se ejecuta con el `AppRouter.jsx` aislado de esta rama.

## Contrato simulado de pedidos

Clave de `localStorage`: `sonidoVivo_pedidos`.

Campos compatibles con la vista de vendedor:

- `id`: identificador numérico.
- `cliente`, `correo`: datos usados por el listado de pedidos.
- `tipoEntrega`: `Starken`, `Chilexpress` o `Retiro en tienda`.
- `estado`: `En preparación`, `Despachado` o `Entregado`.
- `numeroSeguimiento` y `total`.

El cliente conserva campos adicionales (`folio`, `datosCliente`, `entrega`, `items` y `fecha`) para confirmar y consultar su compra. Esta es persistencia simulada en el navegador, no una llamada real a Spring Boot.

## Pendiente de coordinación

La rama de vendedor incluida en los archivos de trabajo mantiene un catálogo de stock de ejemplo distinto del catálogo oficial con códigos como `GA001`. Para sincronizar cambios reales de inventario entre ambas vistas, el equipo debe acordar una fuente común por código de producto; esta rama no modifica los archivos del vendedor.
