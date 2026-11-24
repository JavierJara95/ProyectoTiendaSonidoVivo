# EP3 · Usuarios, roles y autenticación de Sonido Vivo

Este módulo corresponde a Esteban en la rama propuesta `feature/backend-usuarios-auth`. El frontend de main conserva la gestión, el dashboard y los reportes. Usuarios y sesiones utilizan Spring y MySQL. Los datos de ventas e inventario del dashboard siguen el flujo de EP2 hasta integrar pedidos y catálogo del equipo.

## Ejecutar en Windows

1. Inicia MySQL en XAMPP. En phpMyAdmin, pestaña **Importar**, ejecuta `database/01_schema_usuarios.sql` de la raíz del proyecto. Crea la base, las dos tablas y los tres roles. El puerto predeterminado de este proyecto es 3307.
2. En PowerShell, desde la raíz descomprimida, ejecuta lo siguiente con JDK 21 instalado. Configura el mismo JWT_SECRET en catálogo y pedidos. Guarda ese valor de forma privada para reutilizarlo después de reiniciar.

```powershell
cd backend/ms-usuarios-auth
$env:DB_USER = Read-Host "Usuario MySQL"
$env:DB_PASSWORD = [System.Net.NetworkCredential]::new("", (Read-Host "Clave MySQL (Enter si está vacía)" -AsSecureString)).Password
$env:ADMIN_PASSWORD = [System.Net.NetworkCredential]::new("", (Read-Host "Clave inicial del administrador" -AsSecureString)).Password
$bytes = New-Object byte[] 32
$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
$rng.GetBytes($bytes)
$rng.Dispose()
$env:JWT_SECRET = [Convert]::ToBase64String($bytes)
.\mvnw.cmd spring-boot:run
```

Si MySQL usa el puerto 3306, define `$env:DB_URL = "jdbc:mysql://localhost:3306/sonidovivo_usuarios"` antes de arrancar. La primera ejecución de Maven requiere Internet. En una base vacía el servicio crea **admin@sonidovivo.cl** con la clave inicial (mínimo ocho caracteres, una mayúscula, una minúscula y un número). En los siguientes arranques conserva el hash existente. Las cuentas locales de demostración de EP2 deben crearse de nuevo desde Gestión o Registro.

3. En otra terminal, desde la raíz, inicia React con Node 22.12 o posterior.

```powershell
cd frontend
npm ci
npm run dev
```

4. Abre **http://localhost:5173**, entra como administrador y abre **Usuarios**. Crea una cuenta de vendedor y otra de cliente para comparar los accesos. La configuración opcional `VITE_AUTH_API_URL` cambia la base del servicio; por defecto es `http://localhost:8083/api`.

## Contrato de integración

| Operación | Acceso | Resultado |
|---|---|---|
| POST /api/auth/register | Público | Crea cliente activo. Devuelve 201 con token y usuario |
| POST /api/auth/login | Público | Recibe email y password. Devuelve token, expiresAt y user |
| GET /api/auth/me | Cualquier cuenta activa con token válido | Perfil actualizado |
| GET /api/usuarios y GET /api/usuarios/{id} | ADMIN | Lista o detalle |
| POST /api/usuarios | ADMIN | Crea una cuenta con el rol indicado |
| PUT /api/usuarios/{id} | ADMIN | Edita nombre, email, contraseña opcional, rol y estado |
| PATCH /api/usuarios/{id}/estado | ADMIN | Recibe {"activo":true} o {"activo":false} |
| DELETE /api/usuarios/{id} | ADMIN | Elimina la cuenta, respuesta 204 |

El registro público asigna ROLE_CLIENTE en el servidor. En gestión, el campo de entrada es `rol` con valor `admin`, `vendedor` o `cliente`. El JWT usa HS256, con el secreto compartido como texto UTF-8 (incluido el texto Base64 generado arriba), sub igual al ID de usuario, iat, exp, version, rol y roles. Por ejemplo, el token de un vendedor lleva `"rol":"ROLE_VENDEDOR"` y `"roles":["ROLE_VENDEDOR"]`. El DTO que usa React presenta `user.rol` en minúscula para conservar sus rutas.

Envía `Authorization: Bearer <token>`. En Swagger, abre **http://localhost:8083/swagger-ui/index.html**, ejecuta login, copia el valor de token y pégalo en **Authorize**. La sesión dura 30 minutos. React la guarda en sessionStorage, verifica /me al recargar y cierra sesión al vencer. Usuarios verifica además el estado, rol y versión actuales en BD. Los servicios que comprueban únicamente la firma y la caducidad pueden aceptar un token previo hasta su vencimiento.

## Comprobar para la defensa

- Registra un cliente y recarga su página. En Swagger, usa su token en GET /api/usuarios y comprueba el 403. Repite sin token para comprobar el 401.
- Con el token de administrador crea un vendedor. Inicia sesión como vendedor y comprueba que tiene acceso al panel vendedor y recibe 403 al consultar usuarios.
- Desactiva al vendedor desde Gestión. Prueba su token anterior en /api/auth/me y comprueba el 401. Reactiva la cuenta y vuelve a iniciar sesión.
- Para ejecutar las pruebas de integración usa `.\mvnw.cmd test` en este módulo. Usan HTTP real, Spring Security y H2 en memoria. Para ejecutar las pruebas del frontend usa `npm test` en frontend.
