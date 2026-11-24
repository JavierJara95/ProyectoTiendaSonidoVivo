# Matriz de pruebas EP3 — Sonido Vivo

**Registro de verificación:** 24 de noviembre de 2026.  
**Fuente:** ejecuciones manuales y automatizadas informadas por el equipo durante la revisión de EP3.  
**Observación:** los resultados representan las pruebas reportadas, no una certificación externa. Conservar capturas y salidas de terminal para sustentar la entrega.

## Resumen de pruebas automatizadas

| Componente | Resultado informado | Estado |
|---|---|---|
| Frontend React/Vitest | 107 pruebas aprobadas de 107; `npm.cmd run build` correcto | Aprobado |
| `ms-catalogo` | `mvnw.cmd test`: BUILD SUCCESS | Aprobado; archivar log |
| `ms-pedidos` | `mvnw.cmd test`: 9 pruebas aprobadas de 9 tras corregir el mock de incidencia | Aprobado |
| `ms-usuarios-auth` | `mvnw.cmd test`: BUILD SUCCESS | Aprobado; archivar log |

## Matriz de pruebas manuales y de integración

| ID | Caso de prueba | Resultado registrado | Estado |
|---|---|---|---|
| P01 | Acceso a Swagger y servicios REST 8081/8082/8083 | Se verificó operación del sistema y Swagger en catálogo y usuarios; completar capturas del servicio de pedidos | Parcial |
| P02 | Registro y login con JWT | Se crearon usuarios cliente y vendedor; login funcional y persistencia en MySQL | Aprobado |
| P03 | GET `/api/auth/me` con/sin JWT | Se verificó sesión válida y 401 en `/api/usuarios` sin token; no consta prueba específica de `/api/auth/me` | Parcial |
| P04 | CLIENTE GET `/api/usuarios` | Backend devuelve 403 para cliente | Aprobado |
| P05 | ADMIN crea, modifica, desactiva y reactiva usuario | Persistencia MySQL; el login del usuario desactivado es rechazado | Aprobado |
| P06 | CLIENTE realiza compra y confirma descuento de stock | Pedido con folio y stock GA001 reducido de 8 a 7; MySQL confirma | Aprobado |
| P07 | Compra con stock insuficiente | No consta prueba manual específica de 409; verificar antes de presentarla como E2E | Pendiente |
| P08 | CLIENTE intenta consultar pedido ajeno | HTTP 403, y `/api/pedidos/mis-pedidos` devuelve la lista propia | Aprobado |
| P09 | VENDEDOR cambia estado y añade seguimiento | Despacho por Chilexpress con código de seguimiento y MySQL actualizados | Aprobado |
| P10 | VENDEDOR entrega pedido | Estado ENTREGADO reflejado en cliente y MySQL | Aprobado |
| P11 | CLIENTE intenta modificar stock/roles mediante API | Las rutas restringidas se comprobaron visualmente y el backend rechazó acceso a usuarios; completar PUT directo a stock con rol CLIENTE | Parcial |
| P12 | ADMIN consulta dashboard y reportes reales | Cifras cotejadas con MySQL y exportación CSV verificada | Aprobado |
| P13 | Recarga React con sesión válida | Sesión conservada después de F5 | Aprobado |
| P14 | Caducidad JWT | Se simuló `expiresAt=1` en React y se verificó 401 con token inválido; no equivale a esperar expiración firmada real | Parcial |
| P15 | Compilación y pruebas | React 107/107; Maven BUILD SUCCESS en los tres microservicios; pedidos 9/9 | Aprobado |
| P16 | Responsive 360, 768 y 1280 px | Se comprobaron pantallas y navegación responsive | Aprobado |
| P17 | Incidencia/compensación por error del catálogo | Prueba unitaria de `PedidoServiceTest` aprobada; no consta simulación manual E2E multiítem | Parcial |

## Comprobaciones adicionales realizadas

- CRUD completo de productos desde Swagger: POST, GET, PUT, DELETE y verificación de 404 después del borrado.
- Ajuste manual de stock desde el panel de vendedor y persistencia en MySQL.
- Validación de formularios (campos obligatorios, email y contraseñas).
- Backend responde 404 ante consulta de producto inexistente.
- Roles CLIENTE, VENDEDOR y ADMIN comprobados desde React y backend.

## Pendientes para la entrega final

1. Insertar capturas reales en `documentacion/MANUAL_USUARIO_EP3.md` o entregar manual ilustrado en PDF/Word.
2. Adjuntar o conservar registros de terminal de Vitest y Maven donde se vean número de pruebas y `BUILD SUCCESS`.
3. Registrar cantidad de pruebas de `ms-catalogo` y `ms-usuarios-auth` a partir de sus reportes Surefire.
4. Completar las pruebas marcadas como parciales o pendientes si el tiempo lo permite, sin declararlas aprobadas indebidamente.
5. Grabar video grupal y verificar los enlaces públicos de entrega en AVA.

**Importante:** no publicar `JWT_SECRET`, `ADMIN_PASSWORD`, credenciales, tokens completos ni archivos `.env` locales. Los montos del dashboard representan pedidos con stock confirmado, no pagos cobrados.

