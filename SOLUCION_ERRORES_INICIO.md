# Solución de errores de inicio — Sonido Vivo EP3

## 1. React / Vite: Identifier 'productos' has already been declared

**Corregido en esta versión.** El archivo `frontend/src/pages/cliente/CatalogoPage.jsx` tenía el mismo bloque de estados (`productos`, `cargando`, `errorCarga`) y `useEffect` copiados dos veces. También tenía duplicados los avisos de carga. Se quitó la segunda copia, conservando diseño, filtros y llamadas a la API.

Después de extraer este ZIP en **una carpeta nueva** (no mezclar con el ZIP viejo), ejecuta `INICIAR_SONIDO_VIVO.bat`. Si Vite sigue mostrando el mismo error, verifica que estés entrando al frontend de la carpeta nueva y recarga con `Ctrl + F5`.

## 2. Swagger no carga en usuarios (8083) o catálogo (8081)

**No es posible determinar la causa exacta sin la salida de la terminal Spring Boot.** El código permite acceder anónimamente a `/swagger-ui/**` y `/v3/api-docs/**`; es decir, no deberías tener que iniciar sesión para abrir la interfaz Swagger. Puede no abrir porque el servicio no terminó de arrancar, falla MySQL o Java, la importación SQL está pendiente, o Maven falló.

1. Inicia MySQL con XAMPP, comprueba que escuche en puerto `3307` (si usa `3306`, copia `config.local.ejemplo.bat` a `config.local.bat` y cambia `MYSQL_PORT=3306`).
2. Confirma en phpMyAdmin que existen las bases `sonidovivo_usuarios`, `sonido_vivo_catalogo`, `sonido_vivo_pedidos`, y sus tablas. Si no existen, importa `database/01_schema_usuarios.sql`, `02_schema_catalogo.sql`, `03_schema_pedidos.sql` en ese orden. **Respaldar datos existentes antes de reimportar**, porque el SQL de catálogo actualiza registros.
3. Verifica que tengas JDK 21, Node.js 22.12 o superior y que los tres servicios compartan el `JWT_SECRET` generado por el iniciador; no copies secretos a GitHub.
4. Ejecuta el iniciador desde la carpeta raíz. En cada terminal backend debe aparecer al final `Started ...Application` o una indicación equivalente, **sin** mensajes `BUILD FAILURE`, `Access denied for user`, `Unknown database`, `Schema-validation` o `Communications link failure`.
5. Ejecuta `DIAGNOSTICAR_SONIDO_VIVO.bat`, que revisa si responden `/v3/api-docs` de 8081/8082/8083 y React en 5173. La prueba de puerto MySQL solo comprueba conexión TCP, no las credenciales ni las tablas.
6. Abre Swagger en `http://localhost:8081/swagger-ui/index.html`, `http://localhost:8082/swagger-ui/index.html` y `http://localhost:8083/swagger-ui/index.html`.

**Interpretación:** `SIN CONEXION` significa que no está atendiendo el servicio; HTTP `404` indica que el servidor responde pero el endpoint de la documentación no está disponible; `500` indica excepción en backend; `401/403` indica bloqueo de seguridad y es inesperado para la documentación.

Si el diagnóstico detecta un error, comparte **las últimas 20–30 líneas de la terminal del servicio que falla** (sin contraseñas ni JWT). Una captura de navegador sola no permite saber por qué Spring Boot no inició.

## 3. Comprobaciones posteriores

- En `frontend/`: `npm run build`; debe finalizar sin errores.
- En cada microservicio: `mvnw.cmd test` y `mvnw.cmd spring-boot:run`.
- En el navegador, inicia sesión, abre catálogo y verifica que la API de productos responda con un token real.

Esta versión pasa la revisión estática de duplicaciones en JavaScript/JSX, pero **no certifica** compilación Maven, tests npm ni conexión MySQL en tu equipo. Requiere probarlos en Windows con dependencias instaladas.
