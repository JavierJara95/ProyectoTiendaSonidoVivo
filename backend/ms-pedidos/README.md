# Javier — ms-pedidos (Forma B · EP3)

Microservicio **Spring Boot 4.1.1 / Java 21** de pedidos y despachos, puerto `8082`. Este directorio y `../../database/03_schema_pedidos.sql` son **los únicos archivos nuevos del integrante Javier**. Valentina, Esteban y el frontend original no se han modificado.

## 1. Requisitos

- JDK 21 y MySQL 8 o MariaDB; Maven Wrapper incluido (`mvnw.cmd` para Windows).
- `ms-catalogo` de Valentina levantado en `http://localhost:8081`, con datos del archivo `database/02_schema_catalogo.sql`.
- Tokens JWT **HS256** del futuro `ms-usuarios-auth`: deben contener `sub` (ID estable del usuario) y `rol` o `role` (`CLIENTE`, `VENDEDOR`, `ADMIN`).
- **Mismo `JWT_SECRET` en los tres microservicios**, mínimo 32 bytes. No incluir nunca secretos reales en GitHub.

## 2. Preparar base de datos

En MySQL/XAMPP, ejecutar `database/03_schema_pedidos.sql` desde la raíz del proyecto. Crea `sonido_vivo_pedidos` y las tablas normalizadas `pedidos`, `detalles_pedido` y `envios`.

La configuración por defecto apunta a MySQL `127.0.0.1:3307`, igual que el catálogo recibido. Si tu MySQL usa `3306`, asigna `DB_URL` antes de ejecutar.

## 3. Ejecutar en Windows PowerShell

```powershell
cd .\backend\ms-pedidos
$env:DB_URL="jdbc:mysql://127.0.0.1:3307/sonido_vivo_pedidos?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=America/Santiago"
$env:DB_USERNAME="root"
$env:DB_PASSWORD=""  # o tu contraseña LOCAL
$env:JWT_SECRET="coloca_el_mismo_secreto_seguro_de_al_menos_32_bytes"
$env:CATALOGO_URL="http://localhost:8081"
.\mvnw.cmd spring-boot:run
```

En Linux/macOS: `./mvnw spring-boot:run` (desde `backend/ms-pedidos`).

- Swagger: http://localhost:8082/swagger-ui.html
- OpenAPI JSON: http://localhost:8082/v3/api-docs
- Pruebas: `./mvnw test` o `.\mvnw.cmd test`.

**Orden de arranque:** primero MySQL y `ms-catalogo`, luego `ms-pedidos`; `ms-usuarios-auth` (pendiente del trabajo de Esteban) suministrará los JWT reales. Mientras falta el servicio de usuarios, los endpoints protegidos no se podrán probar desde el login actual del frontend.

## 4. Endpoints (Bearer JWT en Swagger → Authorize)

| Método | Ruta | Rol | Acción |
|---|---|---|---|
| POST | `/api/pedidos` | CLIENTE | Crear orden + consultar precio/stock real + descontar en catálogo |
| GET | `/api/pedidos/mis-pedidos` | CLIENTE | Historial **solo del `sub` autenticado** |
| GET | `/api/pedidos` | VENDEDOR, ADMIN | Todos los pedidos, incluidas incidencias |
| GET | `/api/pedidos/{id}` | CLIENTE propietario, VENDEDOR, ADMIN | Consultar pedido |
| PUT | `/api/pedidos/{id}/estado` | VENDEDOR, ADMIN | Actualizar estado y código de seguimiento |
| GET | `/api/seguimiento/{folio}` | CLIENTE propietario, VENDEDOR, ADMIN | Estado y tracking por folio |
| GET | `/api/pedidos/resumen?desde=2026-11-01&hasta=2026-11-30` | VENDEDOR, ADMIN | Resumen y total de pedidos confirmados |
| DELETE | `/api/pedidos/{id}` | ADMIN | Solo puede eliminar incidencias **sin stock descontado** |

Los GET/PUT/DELETE están protegidos. Sin JWT → `401`, rol incorrecto o pedido ajeno → `403`; errores de validación → `400`; no encontrado → `404`; reglas de negocio/stock → `409`; catálogo fuera de servicio → `502`.

### Ejemplo POST /api/pedidos

Enviar `Authorization: Bearer <JWT_CLIENTE>` y `Content-Type: application/json`:

```json
{
  "cliente": { "nombre": "Cliente Ejemplo", "correo": "cliente@ejemplo.cl", "telefono": "912345678" },
  "items": [ { "productoId": 1, "codigo": "GA001", "cantidad": 2 } ],
  "entrega": { "tipo": "Despacho a domicilio", "transportista": "Starken",
    "direccion": "Calle Ejemplo 123", "comuna": "Viña del Mar", "region": "Valparaíso" }
}
```

- El `productoId` debe coincidir con el ID existente de `ms-catalogo`; también se admite **solo `codigo`**, presente en el frontend EP2, para buscarlo por su código dentro del catálogo.
- El precio/total y la identidad `clienteId` **se calculan en servidor**, nunca se confían al frontend.
- Para retiro, usar `"entrega": {"tipo":"Retiro en tienda"}`; no requiere dirección ni tracking.
- Respuesta `201` con `id`, `folio`, `estado` (`EN_PREPARACION`), `estadoDescripcion` (`En preparación`), `estadoStock` (`CONFIRMADO`), `items`, `entrega`, `total` y `fechaCreacion`.
- Para despachar: `PUT /api/pedidos/{id}/estado` con `{"estado":"DESPACHADO","numeroSeguimiento":"STK-123456"}`. Luego `{"estado":"ENTREGADO"}`. Para retiro se permite `EN_PREPARACION → ENTREGADO`.

## 5. Cómo funciona

1. **Controller** valida JWT, rol y JSON de entrada; el `sub` define el dueño del pedido.
2. **Service** consulta datos de `ms-catalogo`, verifica cantidades, y calcula subtotales con precios reales (no acepta precios falsificados por el cliente).
3. **JPA / Repository** guarda `Pedido + DetallePedido + Envio` en MySQL con `estadoStock=PENDIENTE`.
4. **CatalogoClient** llama a `PUT /api/productos/{id}/descontar-stock` con JWT interno de duración breve y rol VENDEDOR, exclusivamente desde el servidor.
5. Si todo funciona, se confirma el stock y el pedido queda `EN_PREPARACION`; vendedor/admin actualiza estados y seguimiento. El resumen suma importes de pedidos confirmados, **no prueba que el dinero haya sido pagado**.

### Nota importante: fallo parcial entre microservicios

Al descontar varios productos, la base de pedidos y el catálogo **no comparten una transacción distribuida**. Si se confirma un descuento pero falla el siguiente, el pedido queda con `estadoStock=INCIDENCIA`, un registro individual `stockDescontado` por detalle, y se devuelve el `folio` para conciliación **manual**. No reintentar inmediatamente: puede producir dobles descuentos. Se necesitaría una API de reserva/liberación/idempotencia en **ms-catalogo**, fuera del alcance de Javier, para garantizar rollback automático entre servicios. Nunca se sobrescribe el stock desde ms-pedidos.

## 6. Pendientes de integración fuera de Javier (NO editados)

- **Frontend:** el ZIP original confirma pedidos en `src/pages/cliente/CarritoPage.jsx` llamando a `src/data/pedidos.js`, que guarda en `localStorage`. El login usa un token aleatorio de `sessionStorage` y no un JWT. Para flujo real debe consumir esta API y enviar Bearer JWT, adaptar lista de pedidos/seguimiento y manejar 401/403/409/502. No se tocó el frontend.
- **Esteban:** falta `ms-usuarios-auth` que emita JWT reales HS256, con claim `sub` estable y `rol`/`role`, mismo `JWT_SECRET`. No se creó ni se tocó `ms-usuarios-auth`.
- **Valentina:** debe estar disponible `ms-catalogo`. El `application.properties` recibido tiene `spring.datasource.url` y `spring.datasource.username` concatenados en la misma línea, por lo que debe revisarlo Valentina **en su propia rama**. No se cambió su código.
- **Entrega EP3:** el ZIP grupal, manual con capturas, documento de integración y video demostrativo exigen evidencias del equipo completo; estos artefactos no son parte de la responsabilidad exclusiva de este microservicio.

## 7. Rama y commits sugeridos

Desde el repositorio clonado (con Git activo):

```bash
git switch -c feature/backend-pedidos
git add backend/ms-pedidos database/03_schema_pedidos.sql
git commit -m "feat(pedidos): entidades JPA y esquema SQL de pedidos"
# Si deseas commits por etapas, agrega primero carpetas model/repository y después service/controller/tests.
git push -u origin feature/backend-pedidos
```

Revisar el PR hacia `main` sin modificar carpetas de los otros integrantes.
