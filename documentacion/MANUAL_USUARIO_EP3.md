# Manual de usuario — Sonido Vivo EP3

> Versión para completar con **capturas reales** una vez que funcione el sistema. No se incluyen capturas ficticias.

## Cliente

1. Abrir `http://localhost:5173/registro`, introducir nombre, correo y contraseña segura, aceptar términos y crear cuenta. Captura pendiente: formulario y mensaje de alta.
2. Ir a `/login`, ingresar usuario y contraseña. La ruta cambia al catálogo del cliente. Captura pendiente: sesión autenticada.
3. Entrar a `Catálogo`. Buscar por nombre/código, filtrar por categoría y precio. Agregar un artículo con stock al carrito. Captura pendiente: catálogo real y disponibilidad.
4. En `Mi carrito`, revisar unidades, completar nombre, email y teléfono, elegir Starken/Chilexpress y dirección o retiro en tienda. Confirmar. El backend reserva stock y devuelve folio. Captura pendiente: carrito, formulario y folio.
5. Entrar a `Seguimiento de pedido`, indicar folio y correo del pedido (sesión autenticada). Consultar estado y número de envío. Un cliente no puede leer pedidos de otra cuenta. Captura pendiente: seguimiento.

## Vendedor

1. Iniciar sesión con cuenta de rol `VENDEDOR` creada por admin.
2. En `Gestión de Pedidos`, consultar pedidos reales. Si es despacho, escribir primero el código de seguimiento y cambiar a `Despachado`; después se puede actualizar el tracking; al finalizar cambiar a `Entregado`. Para retiro en tienda pasar de preparación a entregado. Captura pendiente: estados antes/después.
3. En `Control de Stock`, buscar productos y usar `+`/`-`. El backend modifica la cantidad de forma atómica. Captura pendiente: stock previo y posterior en la base de datos.

## Administrador

1. Iniciar sesión como `admin@sonidovivo.cl` con la contraseña inicial configurada por entorno.
2. En `Usuarios`, crear, editar y desactivar cuentas. Asignar `ADMIN`, `VENDEDOR` o `CLIENTE`. Se impide desactivar la propia cuenta de administrador. Captura pendiente: lista/alta/rol.
3. En `Dashboard` y `Reportes`, revisar monto de **pedidos confirmados**, inventario y usuarios; aplicar filtro de fechas y exportar CSV. **No confundir monto de pedidos con pagos cobrados**. Captura pendiente: gráfico y tabla.

## Errores esperados

- Error 401: falta JWT o ha vencido → reingresar.
- Error 403: rol sin permiso → solicitar acceso al administrador, no compartir tokens.
- Error 409: cantidad sin stock o estado de despacho inválido → revisar disponibilidad o seguir flujo permitido.
- Mensaje de conexión fallida: comprobar MySQL y los tres servicios 8081, 8082 y 8083.

**Antes de entregar:** sustituir las indicaciones «Captura pendiente» por capturas efectivas realizadas en la aplicación. Ocultar secretos y tokens completos.
