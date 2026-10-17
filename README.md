# Sonido Vivo · Módulo de Esteban

Implementación completa para el Parcial 2 en React + Vite + Bootstrap.

## Qué está terminado

- Navbar, Footer, Layout adaptable y React Router.
- Inicio de sesión y registro con validaciones y mensajes de error.
- Roles `admin`, `vendedor` y `cliente`, cierre de sesión y rutas protegidas.
- Sesión por pestaña durante 8 horas y recuperación al recargar.
- Listar, buscar y filtrar usuarios; crear, editar, cambiar rol, activar y desactivar cuentas.
- Validación de correos únicos y protección de la propia cuenta del administrador.
- Dashboard de ventas, pedidos, usuarios y existencias.
- Reportes por fecha, gráficos por día y categoría, ticket promedio y exportación CSV.
- Cuatro pruebas principales asignadas en `src/tests/admin.test.jsx` y 26 comprobaciones adicionales.

La aplicación es una simulación del frontend. Los usuarios se guardan en localStorage y la sesión en sessionStorage. Las contraseñas se derivan con PBKDF2; el control real de identidad y permisos requiere el futuro backend.

## Accesos para probar

Contraseña de las tres cuentas iniciales: **Sonido2026!**

| Rol | Correo | Entrada |
| --- | --- | --- |
| Administrador | admin@sonidovivo.cl | /admin |
| Vendedor | vendedor@sonidovivo.cl | /vendedor/pedidos |
| Cliente | cliente@sonidovivo.cl | /cliente/catalogo |

El registro público crea exclusivamente clientes. Solo el administrador puede asignar roles.

## Integración con el proyecto del equipo

Este ZIP conserva la raíz `ProyectoTiendaSonidoVivo-feature-admin-gestion` y la carpeta `frontend` del proyecto enviado. Completa todos los archivos del módulo de Esteban.

Las páginas y pruebas originales de cliente y vendedor se conservan con su contenido original. Si estaban vacías, permanecen vacías: son responsabilidad de Valentina y Javier. El router muestra una vista de integración para esos módulos hasta que se conecten sus componentes.

Los productos que usa el dashboard están en `frontend/src/data/admin/productos.json`: es una copia de 51 referencias representativas del catálogo del caso. Las 340 referencias corresponden al contexto de la tienda; no se inventó un catálogo completo de 340. Los pedidos del dashboard son sintéticos y se generan con fechas recientes.

No se modifica la gestión de stock ni el flujo de pedidos de los compañeros. Las claves compartibles y el contrato de datos se describen en `docs/INTEGRACION.md`.

Se corrigieron dos nombres de archivos vacíos del proyecto original:

- `DashboardAdminPage,jsx` → `DashboardAdminPage.jsx`.
- `ResportesVentasPage.jsx` → `ReportesVentasPage.jsx`.

Si copias sobre tu carpeta existente, elimina los dos nombres antiguos para evitar duplicados. El código utiliza los nombres corregidos.

## Copiar por commits

Usa la entrega complementaria `Esteban-por-commits.zip` y lee primero `LEEME_PRIMERO.md`. Sus cinco bloques contienen solo los archivos nuevos o modificados respecto del bloque anterior. Incluyen las versiones de App, rutas y servicios que corresponden a cada etapa para evitar importaciones a archivos todavía no incorporados.

No copies el proyecto completo antes de aplicar los bloques si quieres guardar los avances por separado. Si ya hiciste el primer commit de base y Layout, el bloque 01 solo agrega o ajusta lo que falte: revisa Changes y continúa con el 02.

Tu rama es `feature/admin-gestion`. Los commits se guardan desde GitHub Desktop; no requieren comandos npm.

## Ejecución y pruebas

Si ya instalaste las dependencias, no necesitas reinstalarlas para copiar archivos ni para guardar commits. Se conserva el mismo package.json y package-lock.json de la base que ya tenías.

Cuando quieras abrir la aplicación, ejecuta desde `frontend` el script `dev`. Los scripts disponibles son `dev`, `build`, `preview`, `test` y `test:coverage`.

Validación de esta entrega: ver `docs/VERIFICACION.md`.

## Archivos principales

| Responsabilidad | Ubicación dentro de frontend |
| --- | --- |
| Layout, menú y pie | src/components/common/ |
| Login y registro | src/pages/auth/ |
| Usuarios, dashboard y reportes | src/pages/admin/ |
| Router y restricciones | src/routes/ |
| Estado de sesión | src/context/AuthContext.jsx |
| Lógica y persistencia | src/services/ y src/utils/ |
| Cuentas iniciales | src/data/usuarios.json |
| Estilos adaptables | src/styles/app.css |
| Pruebas | src/tests/admin.test.jsx y suites complementarias |
