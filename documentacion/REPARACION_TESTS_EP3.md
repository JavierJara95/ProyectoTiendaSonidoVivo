# Adaptación de pruebas Vitest — EP3 Sonido Vivo (24-11-2026)

## Origen

Informe entregado por el equipo: 15 archivos de prueba, 107 pruebas; 50 correctas, 57 fallidas y un rechazo de promesa sin controlar. El informe se generó desde el frontend integrado con API REST/JWT, mientras que varios tests aún verificaban el backend simulado en `localStorage` de la EP2.

## Cambios

Todos los cambios de código de este ZIP están limitados a `frontend/src/tests/`.

- `mockBackend.js`: simulador de respuestas HTTP en memoria para autenticación JWT, CRUD de usuarios, productos y pedidos. Solo se utiliza en Vitest; no conecta con MySQL ni modifica la aplicación de producción.
- `setup.js` y `helpers.js`: cada prueba recibe un estado limpio; los usuarios de demostración se representan mediante la estructura real de sesión JWT del frontend.
- `authService.test.js` mantiene sus pruebas originales sin cambios; ahora el inicio de sesión utiliza el simulador REST compartido.
- `usuariosService.test.js`: elimina expectativas obsoletas de persistencia de contraseñas en `localStorage`, espera correctamente las funciones asíncronas y prueba permisos y validaciones mediante respuestas REST simuladas.
- `reportesService.test.js`: contabiliza pedidos `estadoStock=CONFIRMADO` (no confundir pedidos con pagos recibidos).
- `catalogo-page.test.jsx`, `detalle-producto.test.jsx`, `vendedor-stock.test.jsx` y `vendedor-pedidos.test.jsx`: simulan los servicios REST y esperan la carga asíncrona antes de consultar el DOM.
- `cliente-integrado.test.jsx`: añade el contexto de autenticación simulado, simula seguimiento remoto de pedidos y espera resultados asíncronos.
- `admin.test.jsx`, `adminInteractions.test.jsx`: esperan que lleguen los datos del backend antes de interactuar con los controles.

Se conservaron todos los casos de prueba: ninguno se marcó `skip` ni se eliminó. Algunos tests históricos de EP2 continúan ejercitando sus funciones locales legadas, y los tests EP3 cubren las nuevas llamadas REST.

## Limitación de verificación

Se analizó el reporte de errores entregado por el equipo y se validó sintácticamente el código JavaScript/JSX actualizado. No se pudo ejecutar Vitest en este entorno porque las dependencias npm de la aplicación no están instaladas. **No debe declararse la batería de 107 tests como aprobada sin repetirla en el computador del equipo.**

## Cómo volver a probar en Windows

1. Descomprimir el ZIP corregido en una carpeta nueva, o incorporar solo el parche de pruebas sobre la versión que ya funciona.
2. Abrir PowerShell o la terminal de VS Code dentro de `frontend`.
3. Ejecutar `npm.cmd ci` (solo si falta `node_modules`).
4. Ejecutar `npm.cmd run test:ep3`.
5. Ejecutar `npm.cmd test`.
6. Ejecutar `npm.cmd run build`.
7. Si continúa algún fallo, guardar el reporte con `npm.cmd test -- --reporter=verbose > reporte-tests-v2.txt 2>&1` y revisar **la primera aserción fallida por archivo**, no solo el resumen.

Ni el frontend de producción ni los microservicios, scripts SQL, credenciales locales o datos existentes en MySQL se modifican en esta adaptación de las pruebas.
