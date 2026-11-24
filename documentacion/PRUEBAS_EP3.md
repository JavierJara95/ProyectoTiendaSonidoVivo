# Matriz de pruebas EP3 — pendiente de ejecución real

**Estado**: la revisión estática de fuentes no equivale a aprobación funcional. Registrar fecha, capturas y resultado de cada caso al ejecutarlo en Windows/Java/MySQL.

| Caso | Pasos | Resultado esperado | Estado |
|---|---|---|---|
| P01 | Levantar cada ms y entrar Swagger | 8081, 8082, 8083 con `/v3/api-docs` y Swagger | Pendiente |
| P02 | `POST /api/auth/register`, `POST /api/auth/login` | alta 201 y sesión JWT | Pendiente |
| P03 | GET `/api/auth/me` con JWT y sin JWT | 200 y 401 respectivamente | Pendiente |
| P04 | CLIENTE GET `/api/usuarios` | 403 | Pendiente |
| P05 | ADMIN crear y desactivar usuario | Registro persistido en MySQL; inactivo no puede ingresar | Pendiente |
| P06 | CLIENTE agregar carrito -> pedir retiro | Pedido creado, folio y stock descontado | Pendiente |
| P07 | CLIENTE comprar producto agotado | 409, sin pedido confirmado | Pendiente |
| P08 | CLIENTE buscar pedido ajeno por folio | 403 | Pendiente |
| P09 | VENDEDOR cambiar despacho con tracking | 200, estado y seguimiento persistidos | Pendiente |
| P10 | VENDEDOR cambiar a ENTREGADO | 200, sólo transición válida | Pendiente |
| P11 | CLIENTE PUT stock o roles | 403 | Pendiente |
| P12 | ADMIN lista pedidos y consulta dashboard | datos provenientes de SQL, no localStorage | Pendiente |
| P13 | Recargar pestaña con JWT válido | se mantiene sesión; `/api/auth/me` es consultado | Pendiente |
| P14 | Forzar expiración JWT y recargar | vuelve a login | Pendiente |
| P15 | Ejecutar con `npm run build`, `npm test`, `mvnw.cmd test` en cada ms | registrar salida real y fallos | Pendiente |
| P16 | Anchos 360, 768 y 1280px | sin cortes de contenidos ni acciones inaccesibles | Pendiente |
| P17 | Interrumpir catálogo durante pedido multiítem | incidencia, compensación donde esté confirmada | Pendiente |

### Información de seguridad
No mostrar valores completos de `JWT_SECRET`, `ADMIN_PASSWORD` ni tokens en grabaciones públicas. La firma se valida en backend aunque se oculten los botones en frontend.
