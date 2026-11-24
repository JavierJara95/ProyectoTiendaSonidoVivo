# Registro de cambios — integración EP3 (24/11/2026)

Esta edición se basa en el ZIP `ProyectoTiendaSonidoVivo-main(1).zip`, no en el ZIP parcial anterior.

## Modificado

- `backend/ms-catalogo/src/main/resources/application.properties`: corrección del salto de línea entre URL y usuario; dialecto MySQL.
- `backend/ms-catalogo`: nuevo endpoint `PUT /api/productos/{id}/ajustar-stock`, con bloqueo de fila y delta firmado para no sobrescribir producto completo al cambiar inventario. CORS localhost/127.0.0.1.
- `backend/ms-pedidos`: compensación de descuentos anteriores confirmados al fallar un pedido multiítem; se deja incidencia para situaciones inciertas. Permite actualizar el tracking de un pedido ya despachado. El ADMIN puede registrar pedidos.
- `backend/ms-usuarios-auth/src/main/resources/application.properties`: usuario de DB estandarizado con `DB_USERNAME`, valor local `root` por defecto; ningún secreto de ejemplo en código.
- `frontend/src/services/api.js`: fetch JSON centralizado, JWT Bearer, manejo de 401/403/errores y puertos configurables.
- `frontend/src/services/authService.js`, `context/AuthContext.jsx`: login real, JWT emitido por Spring Boot, `/api/auth/me` en recarga y limpieza de sesión expirada. No se generan tokens ficticios.
- `frontend/src/services/usuariosService.js`, `pages/admin/GestionUsuariosPage.jsx`: CRUD real y activar/desactivar mediante API 8083.
- `frontend/src/services/catalogoService.js`, páginas de catálogo, detalle y control de stock: datos reales de catálogo 8081; ajuste de stock atómico.
- `frontend/src/services/pedidosService.js`, páginas de carrito, seguimiento y vendedor: creación/consulta/estado/tracking real de pedidos 8082.
- `frontend/src/services/reportesService.js`, dashboard y reportes: montos agregados desde APIs reales. Etiquetas dejan explícito que no certifican pagos cobrados.
- `frontend/src/services/bootstrapService.js`: desactivación de semilla local simulada; el runtime no depende de usuarios/pedidos ficticios.
- `frontend/.env.example`: URL de las API configurables.
- `frontend/src/tests/ep3-api.test.js`: pruebas unitarias de adaptadores HTTP y sesión con fetch simulado; comando `npm run test:ep3`.
- `backend/ms-usuarios-auth/.attach_pid72`: archivo temporal vacío excluido.
- Documentación: `INTEGRACION_EP3.md`, `MANUAL_USUARIO_EP3.md`, `PRUEBAS_EP3.md`, este registro.

## Sin modificar deliberadamente

- Diseño visual general y assets del frontend (se mantiene aspecto original).
- Productos SQL (51 filas reales del Excel de muestra, no se inventan las 289 ausentes).
- Código de pagos reales (no aparece pasarela en el caso entregado).
- Video grupal y capturas reales: deben hacerse ejecutando el sistema, no pueden fabricarse en una inspección estática.
- Tests heredados de EP2 que dependían de localStorage: se conservan y requieren adaptación al backend real.

## Estado de pruebas

- Verificado: ZIP fuente extraído, fuentes React JavaScript/JSX analizados mediante parser TypeScript (85 archivos, sin errores sintácticos), sintaxis de `.js` comprobada con Node.
- No verificado: compilación Maven completa, conexión MySQL, pruebas HTTP end-to-end, `npm run build` y `npm test`. No se pudieron instalar dependencias: `npm ci --offline` devolvió ENOTCACHED; Maven Wrapper intentó descargar Maven y falló por falta de red.
- Para aprobar EP3, ejecutar los casos de `PRUEBAS_EP3.md`, corregir cualquier fallo real y aportar capturas y video antes de subir a GitHub.
