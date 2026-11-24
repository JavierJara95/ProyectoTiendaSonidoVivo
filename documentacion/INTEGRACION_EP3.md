# Sonido Vivo — EP3: integración React + Spring Boot + MySQL

## Arquitectura

- React/Vite (`frontend/`, puerto 5173): cliente web, carrito, vendedores y administración. Solo hace llamadas HTTP a las API. **No** lee directamente MySQL.
- Spring Boot `ms-catalogo` (8081): productos, categorías, inventario y operaciones de stock. BD `sonido_vivo_catalogo`.
- Spring Boot `ms-pedidos` (8082): pedidos, detalles, envíos, seguimiento y resumen. BD `sonido_vivo_pedidos`.
- Spring Boot `ms-usuarios-auth` (8083): registro, login, administración de usuarios y emisión de JWT. BD `sonidovivo_usuarios`.
- Los servicios REST y React deben compartir un JWT firmado por el mismo `JWT_SECRET`; todos verifican la firma, vencimiento y rol. `ms-usuarios-auth` además consulta el usuario actual para `/api/auth/me`.

## Pre-requisitos y ejecución en Windows (PowerShell)

1. Instalar Java 21, Node.js compatible con `frontend/package.json` y XAMPP/MySQL. Ejemplo local: MySQL en **3307**; si usas 3306, reemplaza el puerto en `DB_URL`.
2. Ejecutar los scripts en orden `database/01_schema_usuarios.sql`, `database/02_schema_catalogo.sql` y `database/03_schema_pedidos.sql` (cada script crea y selecciona su propia BD). En XAMPP puedes importarlos con phpMyAdmin. Si ya existían datos, hacer respaldo antes de importar.
3. En **tres** terminales PowerShell (una por microservicio) y **en cada terminal**, antes de ejecutar Maven, configurar:

   ```powershell
   $env:DB_USERNAME='root'
   $env:DB_PASSWORD=''
   $env:JWT_SECRET='reemplaza-este-secreto-por-uno-aleatorio-de-al-menos-32-bytes'
   ```

   No subir el secreto a GitHub. Debe ser exactamente el mismo en los tres servicios. Si el MySQL usa otro puerto, configurar `$env:DB_URL` apropiado a **cada base**. Para que `ms-usuarios-auth` cree el primer administrador, configurar `$env:ADMIN_PASSWORD` a una contraseña segura (8+ caracteres, mayúscula, minúscula, número; no publicarla).
4. En el terminal de `backend/ms-usuarios-auth`: `.\mvnw.cmd spring-boot:run`. Servicio 8083.
5. En el terminal de `backend/ms-catalogo`: `.\mvnw.cmd spring-boot:run`. Servicio 8081.
6. En el terminal de `backend/ms-pedidos`: `.\mvnw.cmd spring-boot:run`. Servicio 8082. Opcional: `$env:CATALOGO_URL='http://localhost:8081'`.
7. En `frontend/`: copiar `.env.example` a `.env.local`, luego ejecutar `npm ci`, `npm run dev`. Abrir `http://localhost:5173`.
8. Login del primer admin con `admin@sonidovivo.cl` y la clave de `ADMIN_PASSWORD`; desde administración crear el vendedor, y desde `/registro` crear el cliente.
9. Verificar Swagger: `http://localhost:8081/swagger-ui.html`, `http://localhost:8082/swagger-ui.html`, `http://localhost:8083/swagger-ui.html`. Autorizar con el JWT para recursos protegidos.

**IMPORTANTE**: si el comando `mvnw.cmd` falla por una descarga bloqueada, instalar Maven y usar `mvn spring-boot:run`. No se incluyen compilados en el ZIP; el primer inicio requiere descargar dependencias.

## API y contrato

| Interacción | Servicio | Endpoint | Rol |
|---|---|---|---|
| Registro | Usuarios | POST `/api/auth/register` | Público |
| Login (JWT) | Usuarios | POST `/api/auth/login` | Público |
| Validación de sesión | Usuarios | GET `/api/auth/me` | Autenticado |
| CRUD cuentas | Usuarios | `/api/usuarios` | ADMIN |
| Listar catálogo | Catálogo | GET `/api/productos` | Autenticado |
| Actualizar stock +/- | Catálogo | PUT `/api/productos/{id}/ajustar-stock` `{ "delta": 1 }` | VENDEDOR/ADMIN |
| Descontar por compra | Catálogo | PUT `/api/productos/{id}/descontar-stock` | VENDEDOR/ADMIN (llamada del backend de pedidos) |
| Crear pedido | Pedidos | POST `/api/pedidos` | CLIENTE/ADMIN |
| Ver mis pedidos | Pedidos | GET `/api/pedidos/mis-pedidos` | CLIENTE/ADMIN |
| Consultar seguimiento | Pedidos | GET `/api/seguimiento/{folio}` | Propietario/VENDEDOR/ADMIN |
| Cambiar estado/tracking | Pedidos | PUT `/api/pedidos/{id}/estado` | VENDEDOR/ADMIN |
| Resumen por fecha | Pedidos | GET `/api/pedidos/resumen` | VENDEDOR/ADMIN |

## Flujo completo de compra

1. Cliente se registra e inicia sesión -> backend de usuarios comprueba BCrypt y emite JWT HS256 con `sub`, `rol`, `version` y vencimiento.
2. React guarda token temporalmente en `sessionStorage`. Al recargar, confirma el token mediante `/api/auth/me`; al vencer o recibir 401, limpia la sesión. Las rutas internas se restringen según rol. El servidor vuelve a comprobar permisos.
3. React consulta productos reales a Catálogo. El carrito se mantiene solo en memoria para la compra que todavía no se envía.
4. React envía `POST /api/pedidos` con identificadores o códigos y cantidades, **sin confiar en precios del navegador**. `ms-pedidos` obtiene precios y disponibilidad del catálogo y crea el pedido MySQL.
5. `ms-pedidos` descuenta stock con JWT efímero de servicio y deja el pedido CONFIRMADO si todos los descuentos terminaron.
6. Cliente recibe folio, consulta su propio pedido y vendedor registra despacho y seguimiento. Admin obtiene datos reales para reportes.

## Límites conocidos y verificaciones pendientes

- El Excel de Forma B declara *340 referencias totales (muestra representativa)*, pero **solo contiene 51 productos reales**. SQL conserva las 51 filas oficiales sin inventar 289; si se requiere el total de 340 hay que solicitar los datos faltantes y completar el catálogo con los datos de origen.
- Las cifras del panel son montos **de pedidos confirmados con stock descontado**, no pagos cobrados. La aplicación no incorpora pasarela de pago ni genera guías de despacho en Starken/Chilexpress.
- Una compra multiítem puede fallar a mitad de descuentos. Se intenta compensar automáticamente los descuentos ya *confirmados*. Una respuesta HTTP perdida puede dejar un resultado incierto; el pedido queda en incidencia y requiere conciliación manual. No equivale a una transacción distribuida.
- Usuarios revocados/desactivados se invalidan inmediatamente en `/api/auth/me`, pero otros microservicios validan JWT localmente, de modo que un token previo puede continuar siendo válido hasta su vencimiento (máximo 30 minutos). Reforzar con introspección o lista de revocaciones si se exige invalidación inmediata transversal.
- El formato `sessionStorage` mantiene sesión tras recargar una pestaña; no la comparte entre pestañas. No es un almacenamiento invulnerable a XSS: no insertar HTML no confiable y trabajar con HTTPS en producción.
- Los tests originales de EP2 pueden asumir almacenamiento simulado, por lo que necesitan actualizar mocks/expectativas. Las pruebas de este ZIP requieren ejecución en un entorno con dependencias descargadas y MySQL disponible. No afirmar cobertura aprobada sin ejecutarlas.
- **Manual y video**: la documentación incluye instrucciones, pero deben agregarse capturas reales tomadas de la aplicación ya ejecutada y grabar el video real grupal requerido por la pauta. No hay video generado en este ZIP.
