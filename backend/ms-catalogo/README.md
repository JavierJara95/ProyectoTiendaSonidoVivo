# ms-catalogo — Tienda Sonido Vivo

Microservicio asignado a Valentina para EP3. Puerto `8081`. Administra productos, categorías, marcas y stock.

## Requisitos
- JDK 21
- MySQL
- Maven Wrapper incluido

## Base de datos
1. Crear la base `sonido_vivo_catalogo`.
2. Ejecutar `database/02_schema_catalogo.sql` desde la raíz del repositorio o importar el archivo en MySQL.
3. El script crea tablas y carga los 51 productos de la muestra oficial del Excel. El documento del caso indica 340 referencias totales, pero el Excel entregado contiene solo 51 registros representativos.

## Configuración
Configurar variables de entorno antes de iniciar:

- `DB_URL` (por defecto `jdbc:mysql://localhost:3306/sonido_vivo_catalogo?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=America/Santiago`)
- `DB_USERNAME` (por defecto `root`)
- `DB_PASSWORD` (contraseña local de MySQL)
- `JWT_SECRET` (secreto compartido con ms-usuarios-auth, mínimo 32 caracteres)
- `SERVER_PORT` (por defecto `8081`)

No publicar secretos reales en GitHub. El servicio valida JWT HS256 y lee el rol desde el claim `rol` (acepta también `role`), con valores `ADMIN`, `VENDEDOR` o `CLIENTE`. Confirmar con Esteban que su servicio emita el claim y firme con el mismo secreto antes de integrar.

## Ejecutar en Windows PowerShell
Desde esta carpeta:

```powershell
$env:DB_USERNAME="root"
$env:DB_PASSWORD="tu_clave_local"
$env:JWT_SECRET="un_secreto_compartido_de_al_menos_32_caracteres"
.\mvnw.cmd spring-boot:run
```

Swagger: http://localhost:8081/swagger-ui.html
OpenAPI: http://localhost:8081/v3/api-docs

## Endpoints

| Método | Ruta | Acceso |
|---|---|---|
| GET | `/api/productos` | usuario autenticado |
| GET | `/api/productos/{id}` | usuario autenticado |
| POST | `/api/productos` | ADMIN / VENDEDOR |
| PUT | `/api/productos/{id}` | ADMIN / VENDEDOR |
| DELETE | `/api/productos/{id}` | ADMIN / VENDEDOR |
| PUT | `/api/productos/{id}/descontar-stock` | ADMIN / VENDEDOR |
| GET | `/api/categorias` | usuario autenticado |
| POST, PUT, DELETE | `/api/categorias` | ADMIN / VENDEDOR |

Filtros de productos: `busqueda`, `categoriaId`, `precioMin`, `precioMax`.

Ejemplo: `GET /api/productos?busqueda=guitarra&categoriaId=1&precioMin=50000&precioMax=200000`

Ejemplo JSON para crear/actualizar producto:

```json
{
  "codigo": "GA001",
  "nombre": "Guitarra Acústica Folk",
  "modelo": "F310",
  "descripcion": "Tapa de abeto, aros y fondo de meranti",
  "precio": 129990,
  "stock": 8,
  "categoriaId": 1,
  "marcaId": 1
}
```

Ejemplo para descontar stock:

```json
{ "cantidad": 2 }
```

El descuento valida stock disponible y bloquea la fila durante la operación para evitar que dos solicitudes simultáneas vendan las mismas unidades.

## Respuestas y validaciones
- `200`: consulta o actualización correcta
- `201`: creación correcta
- `204`: eliminación correcta
- `400`: datos inválidos
- `401`: falta un JWT válido
- `403`: rol sin permiso
- `404`: recurso inexistente
- `409`: código duplicado, stock insuficiente o relación que impide eliminar

## Integración pendiente con el equipo
- Javier debe invocar `PUT /api/productos/{id}/descontar-stock` al confirmar la compra desde ms-pedidos.
- Esteban debe emitir JWT HS256 con claim `rol` y el secreto compartido `JWT_SECRET`; si su implementación usa otro claim/algoritmo, coordinar el ajuste de `SecurityConfig` antes de fusionar.
- El frontend debe enviar `Authorization: Bearer <token>`.
