# Integración del módulo de Esteban

## Rutas

Solo `/login` y `/registro` son públicas. Todas las demás rutas exigen una sesión activa. Las cuentas desactivadas no pueden iniciar sesión y la sesión se vuelve a contrastar contra los usuarios guardados.

| Ruta | Permiso |
| --- | --- |
| / | Redirige al inicio del rol |
| /admin | Administrador |
| /admin/usuarios | Administrador |
| /admin/reportes | Administrador |
| /vendedor/* | Administrador o vendedor |
| /cliente/* | Administrador o cliente |
| /tienda | Cualquier usuario autenticado |
| /cuenta | Cualquier usuario autenticado |

Una cuenta sin sesión se redirige a login. Una cuenta con rol no permitido se redirige a `/sin-acceso`. Los permisos de usuarios y reportes se comprueban también en los servicios simulados.

## Conectar páginas de los compañeros

En `src/routes/AppRouter.jsx`, sustituir los elementos `IntegrationPage` de las rutas de cliente y vendedor por las páginas correspondientes. Conservar los envoltorios `ProtectedRoute`, un solo `BrowserRouter` y el Layout principal. Las rutas de usuario y reportes están agrupadas en `src/routes/adminModules.jsx`.

El Layout final contiene un `<Outlet />`: las páginas se renderizan como rutas hijas. No requiere envolver cada página de nuevo con Layout.

## Almacenamiento

| Datos | Clave |
| --- | --- |
| Usuarios | sonido-vivo:v1:usuarios |
| Productos | sonido-vivo:v1:productos |
| Pedidos | sonido-vivo:v1:pedidos |
| Sesión por pestaña | sonido-vivo:v1:sesion |

Usar `writeStorage` de `src/utils/storage.js` para notificar cambios a la UI. El inicializador solo crea datos cuando su clave no existe; no sobreescribe datos que ya estén guardados.

Producto para reportes: `{ codigo, nombre, categoria, marca, precio, stock }`.

Pedido para reportes: `{ id, fecha: 'YYYY-MM-DD', clienteId, clienteNombre, estado, estadoPago, tipoEntrega, items: [{ codigo, categoria, cantidad, precioUnitario }], total }`.

Se consideran ventas únicamente los pedidos con `estadoPago: 'aprobado'` cuyo `estado` sea diferente de `'cancelado'`. Los ingresos suman `total`; las categorías suman los importes de los ítems. Mantener esos totales consistentes al integrar el checkout.

Los reportes muestran datos simulados hasta conectar pedidos y productos del resto del equipo. El archivo de muestra de productos del módulo admin está separado de `src/data/productos.json` y no reemplaza el catálogo del compañero.

## Pruebas del equipo

La configuración activa enumera las seis suites de Esteban para no ejecutar los dos archivos vacíos que venían como plantilla: `cliente.test.jsx` y `vendedor.test.jsx`. Cuando los compañeros implementen sus pruebas, agregar esos dos nombres a `test.include` de `vite.config.js` o adoptar un patrón general después de completar las plantillas.

Las cuatro pruebas asignadas de Esteban están en `admin.test.jsx`: campos de login, redirección sin sesión, restricción por rol y listado/filtrado de usuarios. Las demás suites comprueban registro, CRUD, sesión, reportes y CSV.

## Alcance de la demostración

El almacenamiento del navegador y las rutas protegidas de React permiten demostrar el flujo y la interfaz. Un backend deberá validar permisos, credenciales y datos para un sistema real. No se implementaron las páginas de catálogo, carrito, pedidos, stock ni mapa de Valentina y Javier.
