**DOCUMENTO DE COBERTURA  
DE TESTING**

**Proyecto Tienda Sonido Vivo**

Evaluación Parcial 2 · Desarrollo Fullstack II

| **Módulos evaluados** | Administrador, Cliente y Vendedor                                       |
|-----------------------|-------------------------------------------------------------------------|
| **Integrantes**       | Esteban · Valentina · Javier                                            |
| **Frontend**          | React + Vite + Bootstrap + React Router                                 |
| **Testing**           | Vitest + React Testing Library + jest-dom + user-event + jsdom          |
| **Suite documentada** | 96 pruebas automatizadas                                                |
| **Estado final**      | Suite ejecutada sin errores después de la integración de los tres roles |

**Versión integrada final**

# 1. Objetivo del documento

Este documento registra el alcance del proceso de testing del frontend integrado de Tienda Sonido Vivo. La matriz se construye a partir de los archivos de pruebas automatizadas presentes en el proyecto final y organiza los casos por los tres roles funcionales: Administrador, Cliente y Vendedor.

- Evidenciar qué funcionalidades principales se encuentran cubiertas por pruebas automatizadas.

- Relacionar cada caso de prueba con su archivo, propósito y resultado esperado.

- Documentar la configuración del entorno de pruebas y los conceptos aplicados: renderizado, interacción, persistencia, autorización, mocks y casos límite.

- Servir como respaldo para la presentación y defensa individual del proyecto.

# 2. Configuración y herramientas

| **Runner**         | Vitest 4.1.11                                                                                             |
|--------------------|-----------------------------------------------------------------------------------------------------------|
| **DOM de pruebas** | jsdom 27.4.0                                                                                              |
| **Testing UI**     | React Testing Library 16.3.0                                                                              |
| **Matchers**       | @testing-library/jest-dom 6.9.1                                                                           |
| **Interacción**    | @testing-library/user-event 14.6.1                                                                        |
| **Cobertura**      | @vitest/coverage-v8 4.1.11                                                                                |
| **Configuración**  | vite.config.js → environment: jsdom; setupFiles: ./src/tests/setup.js; restoreMocks: true                 |
| **Aislamiento**    | setup.js limpia localStorage y sessionStorage antes de cada caso, y ejecuta cleanup después de cada caso. |

# 3. Comandos de ejecución

**npm test** — Ejecuta la suite completa una vez mediante vitest run.

**npm run test:watch** — Ejecuta Vitest en modo observación durante el desarrollo.

**npm run test:coverage** — Ejecuta la suite y genera cobertura V8 en texto, HTML y JSON summary.

**npm run build** — Comprueba que el frontend integrado compile para producción.

# 4. Resumen cuantitativo

| **Rol / ámbito**            | **Archivos de prueba** | **Casos** | **Estado**                     |
|-----------------------------|------------------------|-----------|--------------------------------|
| Administrador + integración | 6                      | 30        | Sin errores                    |
| Cliente                     | 5                      | 53        | Sin errores                    |
| Vendedor                    | 3                      | 13        | Sin errores                    |
| **TOTAL**                   | **14**                 | **96**    | **Suite completa sin errores** |

**Nota sobre el resultado:** el estado “Sin errores” corresponde a la ejecución final informada después de corregir la integración de las tres ramas. Este documento no inventa porcentajes de cobertura de líneas; esos porcentajes deben obtenerse con npm run test:coverage si se requieren como anexo numérico.

# 5. Criterios de cobertura aplicados

- Renderizado y DOM: presencia de textos, productos, usuarios, estados, totales y mensajes esperados.

- Interacción: clics, formularios, selects, búsqueda, filtros, navegación y cambios de cantidad/estado/stock.

- Validaciones y casos límite: campos obligatorios, credenciales inválidas, duplicados, stock insuficiente, pedidos inexistentes, periodos de reporte inválidos y rutas no autorizadas.

- Persistencia y sesión: localStorage, sessionStorage, expiración de sesión y conservación/actualización de datos.

- Roles y autorización: acceso diferenciado para Administrador, Cliente y Vendedor mediante rutas protegidas y servicios.

- Mocks: pruebas que aíslan dependencias del navegador, descargas y comportamientos auxiliares cuando corresponde.

# 6. Matriz de pruebas — Rol Administrador

Cobertura principal: autenticación, autorización, gestión de usuarios, reportes, exportación, validaciones de formularios y flujo integrado de sesión.

## 6.1 Casos automatizados de Administrador e integración

**Total documentado: 30 pruebas.** Cada fila corresponde a un caso automatizado existente en src/tests del proyecto integrado.

| **ID** | **Archivo**                | **Caso de prueba**                                                                     | **Tipo**                 | **Resultado esperado**                                                                  |
|--------|----------------------------|----------------------------------------------------------------------------------------|--------------------------|-----------------------------------------------------------------------------------------|
| ADM-01 | authService.test.js        | permite iniciar sesión con correo normalizado y nunca expone la credencial             | Persistencia / sesión    | Permite iniciar sesión con correo normalizado y nunca expone la credencial.             |
| ADM-02 | authService.test.js        | rechaza una contraseña incorrecta sin abrir una sesión                                 | Persistencia / sesión    | Rechaza una contraseña incorrecta sin abrir una sesión.                                 |
| ADM-03 | authService.test.js        | rechaza una cuenta inactiva aunque la contraseña sea correcta                          | Validación / caso límite | Rechaza una cuenta inactiva aunque la contraseña sea correcta.                          |
| ADM-04 | authService.test.js        | invalida la sesión vencida                                                             | Persistencia / sesión    | Invalida la sesión vencida.                                                             |
| ADM-05 | authService.test.js        | rechaza operaciones administrativas para un vendedor                                   | Validación / caso límite | Rechaza operaciones administrativas para un vendedor.                                   |
| ADM-06 | authService.test.js        | el cierre de sesión elimina el acceso                                                  | Persistencia / sesión    | El cierre de sesión elimina el acceso.                                                  |
| ADM-07 | usuariosService.test.js    | crea un usuario persistido con contraseña derivada y rol asignado                      | Persistencia / sesión    | Crea un usuario persistido con contraseña derivada y rol asignado.                      |
| ADM-08 | usuariosService.test.js    | rechaza correos duplicados incluso con espacios y mayúsculas                           | Validación / caso límite | Rechaza correos duplicados incluso con espacios y mayúsculas.                           |
| ADM-09 | usuariosService.test.js    | el registro público fuerza el rol cliente                                              | Rutas / autorización     | El registro público fuerza el rol cliente.                                              |
| ADM-10 | usuariosService.test.js    | valida confirmación de contraseña y consentimiento                                     | Validación / caso límite | Valida confirmación de contraseña y consentimiento.                                     |
| ADM-11 | usuariosService.test.js    | edita datos y rol sin perder la contraseña cuando el campo está vacío                  | Rutas / autorización     | Edita datos y rol sin perder la contraseña cuando el campo está vacío.                  |
| ADM-12 | usuariosService.test.js    | desactiva y reactiva una cuenta; la cuenta inactiva no puede ingresar                  | Lógica funcional         | Desactiva y reactiva una cuenta; la cuenta inactiva no puede ingresar.                  |
| ADM-13 | usuariosService.test.js    | impide que el administrador desactive su propia cuenta o pierda su rol                 | Rutas / autorización     | Impide que el administrador desactive su propia cuenta o pierda su rol.                 |
| ADM-14 | usuariosService.test.js    | rechaza un CRUD de usuarios sin permisos                                               | Validación / caso límite | Rechaza un CRUD de usuarios sin permisos.                                               |
| ADM-15 | reportesService.test.js    | excluye pagos pendientes y pedidos cancelados de los ingresos                          | Lógica funcional         | Excluye pagos pendientes y pedidos cancelados de los ingresos.                          |
| ADM-16 | reportesService.test.js    | filtra fechas incluyendo ambos extremos del período                                    | Filtro / búsqueda        | Filtra fechas incluyendo ambos extremos del período.                                    |
| ADM-17 | reportesService.test.js    | agrupa por categoría y fecha y detecta bajo stock                                      | Lógica funcional         | Agrupa por categoría y fecha y detecta bajo stock.                                      |
| ADM-18 | reportesService.test.js    | maneja períodos sin ventas sin producir NaN                                            | Validación / caso límite | Maneja períodos sin ventas sin producir NaN.                                            |
| ADM-19 | reportesService.test.js    | exporta CSV con comillas escapadas y neutraliza fórmulas en texto                      | Lógica funcional         | Exporta CSV con comillas escapadas y neutraliza fórmulas en texto.                      |
| ADM-20 | reportesService.test.js    | descarga un archivo mediante URL temporal usando mocks                                 | Mock / integración       | Descarga un archivo mediante URL temporal usando mocks.                                 |
| ADM-21 | admin.test.jsx             | muestra validaciones de login sin llamar al servicio con datos incompletos             | Validación / caso límite | Muestra validaciones de login sin llamar al servicio con datos incompletos.             |
| ADM-22 | admin.test.jsx             | redirige al login cuando una ruta administrativa se abre sin sesión                    | Persistencia / sesión    | Redirige al login cuando una ruta administrativa se abre sin sesión.                    |
| ADM-23 | admin.test.jsx             | rechaza una ruta administrativa para el rol vendedor                                   | Rutas / autorización     | Rechaza una ruta administrativa para el rol vendedor.                                   |
| ADM-24 | admin.test.jsx             | renderiza usuarios y filtra por nombre y rol                                           | Rutas / autorización     | Renderiza usuarios y filtra por nombre y rol.                                           |
| ADM-25 | adminInteractions.test.jsx | crea un usuario desde el formulario y actualiza el listado                             | Interacción / lógica     | Crea un usuario desde el formulario y actualiza el listado.                             |
| ADM-26 | adminInteractions.test.jsx | desactiva una cuenta solo después de confirmar                                         | Lógica funcional         | Desactiva una cuenta solo después de confirmar.                                         |
| ADM-27 | adminInteractions.test.jsx | el registro exige coincidencia de contraseñas y aceptación                             | Lógica funcional         | El registro exige coincidencia de contraseñas y aceptación.                             |
| ADM-28 | adminInteractions.test.jsx | rechaza un período de reporte invertido y deja la exportación deshabilitada sin ventas | Validación / caso límite | Rechaza un período de reporte invertido y deja la exportación deshabilitada sin ventas. |
| ADM-29 | appFlow.test.jsx           | inicia sesión, navega por administración y vuelve a login al cerrar sesión             | Persistencia / sesión    | Inicia sesión, navega por administración y vuelve a login al cerrar sesión.             |
| ADM-30 | appFlow.test.jsx           | restaura una sesión válida de cliente y rechaza la URL administrativa                  | Persistencia / sesión    | Restaura una sesión válida de cliente y rechaza la URL administrativa.                  |

# 7. Matriz de pruebas — Rol Cliente

Cobertura principal: catálogo, filtros, detalle de producto, carrito, confirmación de pedido, persistencia del flujo, seguimiento y navegación dentro del módulo cliente.

## 7.1 Casos automatizados de Cliente

**Total documentado: 53 pruebas.** Cada fila corresponde a un caso automatizado existente en src/tests del proyecto integrado.

| **ID** | **Archivo**                | **Caso de prueba**                                                     | **Tipo**                 | **Resultado esperado**                                                  |
|--------|----------------------------|------------------------------------------------------------------------|--------------------------|-------------------------------------------------------------------------|
| CLI-01 | carrito-context.test.jsx   | comienza con el carrito vacío                                          | Lógica funcional         | Comienza con el carrito vacío.                                          |
| CLI-02 | carrito-context.test.jsx   | agrega un producto al carrito                                          | Interacción / lógica     | Agrega un producto al carrito.                                          |
| CLI-03 | carrito-context.test.jsx   | no permite agregar un producto sin stock                               | Validación / caso límite | No permite agregar un producto sin stock.                               |
| CLI-04 | carrito-context.test.jsx   | no permite superar el stock al agregar el mismo producto               | Validación / caso límite | No permite superar el stock al agregar el mismo producto.               |
| CLI-05 | carrito-context.test.jsx   | aumenta la cantidad al agregar nuevamente un producto                  | Interacción / lógica     | Aumenta la cantidad al agregar nuevamente un producto.                  |
| CLI-06 | carrito-context.test.jsx   | limita la cantidad solicitada al stock disponible                      | Lógica funcional         | Limita la cantidad solicitada al stock disponible.                      |
| CLI-07 | carrito-context.test.jsx   | ignora una cantidad vacía y conserva la cantidad actual                | Interacción / lógica     | Ignora una cantidad vacía y conserva la cantidad actual.                |
| CLI-08 | carrito-context.test.jsx   | no modifica el carrito si el código no existe al cambiar cantidad      | Interacción / lógica     | No modifica el carrito si el código no existe al cambiar cantidad.      |
| CLI-09 | carrito-context.test.jsx   | eliminar un producto inexistente conserva los productos existentes     | Interacción / lógica     | Eliminar un producto inexistente conserva los productos existentes.     |
| CLI-10 | carrito-context.test.jsx   | elimina un producto del carrito                                        | Interacción / lógica     | Elimina un producto del carrito.                                        |
| CLI-11 | carrito-context.test.jsx   | vacía todos los productos del carrito                                  | Interacción / lógica     | Vacía todos los productos del carrito.                                  |
| CLI-12 | carrito-context.test.jsx   | ignora los productos con precio no numérico al calcular el total       | Lógica funcional         | Ignora los productos con precio no numérico al calcular el total.       |
| CLI-13 | carrito-context.test.jsx   | lanza un error al usar useCarrito fuera del proveedor                  | Validación / caso límite | Lanza un error al usar useCarrito fuera del proveedor.                  |
| CLI-14 | catalogo-page.test.jsx     | muestra los productos del catálogo                                     | Renderizado / DOM        | Muestra los productos del catálogo.                                     |
| CLI-15 | catalogo-page.test.jsx     | filtra los productos por nombre                                        | Filtro / búsqueda        | Filtra los productos por nombre.                                        |
| CLI-16 | catalogo-page.test.jsx     | filtra los productos por categoría                                     | Filtro / búsqueda        | Filtra los productos por categoría.                                     |
| CLI-17 | catalogo-page.test.jsx     | filtra los productos por precio mínimo                                 | Filtro / búsqueda        | Filtra los productos por precio mínimo.                                 |
| CLI-18 | catalogo-page.test.jsx     | filtra los productos por precio máximo                                 | Filtro / búsqueda        | Filtra los productos por precio máximo.                                 |
| CLI-19 | catalogo-page.test.jsx     | avisa si el precio mínimo supera al precio máximo                      | Lógica funcional         | Avisa si el precio mínimo supera al precio máximo.                      |
| CLI-20 | catalogo-page.test.jsx     | limpia búsqueda, categoría y filtros de precio                         | Filtro / búsqueda        | Limpia búsqueda, categoría y filtros de precio.                         |
| CLI-21 | catalogo-page.test.jsx     | muestra un mensaje cuando no hay resultados                            | Renderizado / DOM        | Muestra un mensaje cuando no hay resultados.                            |
| CLI-22 | catalogo-page.test.jsx     | agrega un producto disponible al carrito                               | Interacción / lógica     | Agrega un producto disponible al carrito.                               |
| CLI-23 | catalogo-page.test.jsx     | deshabilita el botón de un producto sin stock                          | Validación / caso límite | Deshabilita el botón de un producto sin stock.                          |
| CLI-24 | cliente-integrado.test.jsx | muestra el mensaje cuando el carrito está vacío                        | Renderizado / DOM        | Muestra el mensaje cuando el carrito está vacío.                        |
| CLI-25 | cliente-integrado.test.jsx | muestra el producto, el precio y el resumen del carrito                | Renderizado / DOM        | Muestra el producto, el precio y el resumen del carrito.                |
| CLI-26 | cliente-integrado.test.jsx | permite cambiar la cantidad de un producto                             | Interacción / lógica     | Permite cambiar la cantidad de un producto.                             |
| CLI-27 | cliente-integrado.test.jsx | permite quitar un producto del carrito                                 | Lógica funcional         | Permite quitar un producto del carrito.                                 |
| CLI-28 | cliente-integrado.test.jsx | permite vaciar el carrito                                              | Lógica funcional         | Permite vaciar el carrito.                                              |
| CLI-29 | cliente-integrado.test.jsx | muestra errores si se confirma sin completar los datos obligatorios    | Validación / caso límite | Muestra errores si se confirma sin completar los datos obligatorios.    |
| CLI-30 | cliente-integrado.test.jsx | registra un pedido con retiro en tienda y genera un folio              | Interacción / lógica     | Registra un pedido con retiro en tienda y genera un folio.              |
| CLI-31 | cliente-integrado.test.jsx | registra un pedido con despacho por Chilexpress                        | Interacción / lógica     | Registra un pedido con despacho por Chilexpress.                        |
| CLI-32 | cliente-integrado.test.jsx | rechaza registrar un pedido sin productos                              | Validación / caso límite | Rechaza registrar un pedido sin productos.                              |
| CLI-33 | cliente-integrado.test.jsx | muestra la página de seguimiento sin resultados iniciales              | Validación / caso límite | Muestra la página de seguimiento sin resultados iniciales.              |
| CLI-34 | cliente-integrado.test.jsx | muestra un error cuando el pedido no existe                            | Validación / caso límite | Muestra un error cuando el pedido no existe.                            |
| CLI-35 | cliente-integrado.test.jsx | muestra un error cuando el correo no coincide                          | Validación / caso límite | Muestra un error cuando el correo no coincide.                          |
| CLI-36 | cliente-integrado.test.jsx | muestra el estado y los datos de un pedido encontrado                  | Renderizado / DOM        | Muestra el estado y los datos de un pedido encontrado.                  |
| CLI-37 | cliente-integrado.test.jsx | muestra la empresa transportista para pedidos con despacho a domicilio | Renderizado / DOM        | Muestra la empresa transportista para pedidos con despacho a domicilio. |
| CLI-38 | cliente-integrado.test.jsx | muestra el número de seguimiento actualizado por vendedor              | Interacción / lógica     | Muestra el número de seguimiento actualizado por vendedor.              |
| CLI-39 | cliente-integrado.test.jsx | muestra los productos y el total del pedido en el seguimiento          | Renderizado / DOM        | Muestra los productos y el total del pedido en el seguimiento.          |
| CLI-40 | cliente-integrado.test.jsx | incluye enlaces para volver al catálogo y al carrito                   | Renderizado / DOM        | Incluye enlaces para volver al catálogo y al carrito.                   |
| CLI-41 | cliente-integrado.test.jsx | muestra la confirmación y el folio del pedido                          | Renderizado / DOM        | Muestra la confirmación y el folio del pedido.                          |
| CLI-42 | cliente-integrado.test.jsx | muestra los datos del cliente y el total del pedido                    | Renderizado / DOM        | Muestra los datos del cliente y el total del pedido.                    |
| CLI-43 | cliente-integrado.test.jsx | muestra la empresa transportista cuando existe                         | Renderizado / DOM        | Muestra la empresa transportista cuando existe.                         |
| CLI-44 | cliente-integrado.test.jsx | oculta el resumen si no se recibe un pedido                            | Lógica funcional         | Oculta el resumen si no se recibe un pedido.                            |
| CLI-45 | cliente-integrado.test.jsx | oculta el resumen si el folio no coincide con el pedido recibido       | Lógica funcional         | Oculta el resumen si el folio no coincide con el pedido recibido.       |
| CLI-46 | cliente-integrado.test.jsx | incluye enlaces para seguir el pedido y volver al catálogo             | Renderizado / DOM        | Incluye enlaces para seguir el pedido y volver al catálogo.             |
| CLI-47 | cliente-module.test.jsx    | funciona montado bajo la ruta /cliente/\* del router común             | Rutas / autorización     | Funciona montado bajo la ruta /cliente/\* del router común.             |
| CLI-48 | cliente-module.test.jsx    | navega al detalle sin salir del prefijo /cliente                       | Rutas / autorización     | Navega al detalle sin salir del prefijo /cliente.                       |
| CLI-49 | cliente-module.test.jsx    | redirige la entrada /cliente al catálogo del módulo                    | Rutas / autorización     | Redirige la entrada /cliente al catálogo del módulo.                    |
| CLI-50 | detalle-producto.test.jsx  | muestra los datos del producto seleccionado                            | Renderizado / DOM        | Muestra los datos del producto seleccionado.                            |
| CLI-51 | detalle-producto.test.jsx  | permite agregar un producto disponible al carrito                      | Interacción / lógica     | Permite agregar un producto disponible al carrito.                      |
| CLI-52 | detalle-producto.test.jsx  | deshabilita la compra de un producto sin stock                         | Validación / caso límite | Deshabilita la compra de un producto sin stock.                         |
| CLI-53 | detalle-producto.test.jsx  | muestra un mensaje si el producto no existe                            | Renderizado / DOM        | Muestra un mensaje si el producto no existe.                            |

# 8. Matriz de pruebas — Rol Vendedor

Cobertura principal: gestión de pedidos, cambio de estado, número de seguimiento, persistencia local, filtros, resumen operativo, control de stock y puntos de retiro.

## 8.1 Casos automatizados de Vendedor

**Total documentado: 13 pruebas.** Cada fila corresponde a un caso automatizado existente en src/tests del proyecto integrado.

| **ID** | **Archivo**                 | **Caso de prueba**                                | **Tipo**                 | **Resultado esperado**                             |
|--------|-----------------------------|---------------------------------------------------|--------------------------|----------------------------------------------------|
| VEN-01 | vendedor-pedidos.test.jsx   | renderiza la lista de pedidos                     | Renderizado / DOM        | Renderiza la lista de pedidos.                     |
| VEN-02 | vendedor-pedidos.test.jsx   | permite cambiar el estado de un pedido            | Interacción / lógica     | Permite cambiar el estado de un pedido.            |
| VEN-03 | vendedor-pedidos.test.jsx   | permite ingresar un número de seguimiento         | Lógica funcional         | Permite ingresar un número de seguimiento.         |
| VEN-04 | vendedor-pedidos.test.jsx   | guarda los pedidos modificados en localStorage    | Persistencia / sesión    | Guarda los pedidos modificados en localStorage.    |
| VEN-05 | vendedor-pedidos.test.jsx   | permite filtrar pedidos por estado                | Filtro / búsqueda        | Permite filtrar pedidos por estado.                |
| VEN-06 | vendedor-pedidos.test.jsx   | muestra el resumen de pedidos                     | Renderizado / DOM        | Muestra el resumen de pedidos.                     |
| VEN-07 | vendedor-stock.test.jsx     | renderiza los productos                           | Renderizado / DOM        | Renderiza los productos.                           |
| VEN-08 | vendedor-stock.test.jsx     | permite buscar productos                          | Filtro / búsqueda        | Permite buscar productos.                          |
| VEN-09 | vendedor-stock.test.jsx     | permite aumentar el stock                         | Interacción / lógica     | Permite aumentar el stock.                         |
| VEN-10 | vendedor-stock.test.jsx     | no permite disminuir el stock cuando está en cero | Validación / caso límite | No permite disminuir el stock cuando está en cero. |
| VEN-11 | vendedor-stock.test.jsx     | muestra mensaje cuando no existen coincidencias   | Renderizado / DOM        | Muestra mensaje cuando no existen coincidencias.   |
| VEN-12 | vendedor-ubicacion.test.jsx | muestra la información del punto de retiro        | Renderizado / DOM        | Muestra la información del punto de retiro.        |
| VEN-13 | vendedor-ubicacion.test.jsx | muestra el tipo de punto recibido por props       | Renderizado / DOM        | Muestra el tipo de punto recibido por props.       |

# 9. Trazabilidad funcional por rol

| **Rol**       | **Funciones cubiertas**                                 | **Pruebas destacadas**                                                                  | **Evidencia**                                                                       |
|---------------|---------------------------------------------------------|-----------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------|
| Administrador | Login, sesión, roles, usuarios, reportes y exportación. | Credenciales, rutas protegidas, CRUD, activación/desactivación, periodos y CSV.         | authService, usuariosService, reportesService, admin, adminInteractions, appFlow    |
| Cliente       | Catálogo, detalle, carrito, pedido y seguimiento.       | Filtros, stock, cantidades, confirmación, folio, transportista, tracking y navegación.  | catalogo-page, detalle-producto, carrito-context, cliente-integrado, cliente-module |
| Vendedor      | Pedidos, estados, seguimiento, stock y ubicación.       | Cambio de estado, localStorage, filtros, resumen, búsqueda de stock y puntos de retiro. | vendedor-pedidos, vendedor-stock, vendedor-ubicacion                                |

# 10. Resultado y conclusión

La suite integrada documenta 96 casos automatizados distribuidos entre los tres roles. Las pruebas cubren lógica, comportamiento de componentes, manipulación del DOM, interacción del usuario, persistencia, autorización, rutas y casos límite. Tras la integración final de las ramas, el equipo informó que la suite completa se ejecuta sin errores y que los tres roles funcionan correctamente en el frontend unificado.

Para una entrega académica completa, se recomienda adjuntar este documento junto con el enlace público del repositorio, el frontend comprimido y el ERS actualizado. Si se solicita cobertura porcentual de código, ejecutar npm run test:coverage y anexar el resumen generado por V8.

# 11. Evidencias recomendadas para la presentación

- Captura de la terminal con la suite completa en estado PASS.

- Demostración de un test de cada rol y explicación de Arrange–Act–Assert.

- Ejemplo de interacción con userEvent y verificación mediante jest-dom.

- Ejemplo de ruta protegida por rol en Administrador.

- Ejemplo de carrito/seguimiento para Cliente.

- Ejemplo de cambio de estado/stock para Vendedor.

- Explicación de setup.js y del aislamiento de localStorage/sessionStorage entre pruebas.
