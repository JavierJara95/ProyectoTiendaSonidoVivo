# Sonido Vivo — Fullstack II — EP3 (Forma B)

Proyecto académico integrado: React + Vite, tres microservicios Spring Boot, MySQL y autenticación JWT.

## Documentos principales

- [Ejecución e integración](documentacion/INTEGRACION_EP3.md) — **leer primero**; incluye puertos, SQL, variables y endpoints.
- [Cambios aplicados al ZIP](documentacion/CAMBIOS_REALIZADOS.md).
- [Manual de usuario EP3](documentacion/MANUAL_USUARIO_EP3.md) — requiere añadir capturas reales.
- [Plan de pruebas y aceptación EP3](documentacion/PRUEBAS_EP3.md) — por ejecutar antes de la defensa.

## Distribución del trabajo

- **Valentina:** `backend/ms-catalogo/`, `database/02_schema_catalogo.sql`.
- **Javier:** `backend/ms-pedidos/`, `database/03_schema_pedidos.sql`.
- **Esteban:** `backend/ms-usuarios-auth/`, `database/01_schema_usuarios.sql`.
- **Integración transversal:** `frontend/`, documentación y configuración entre servicios. Conviene revisar estos cambios en PR grupal antes de fusionar.

## Puertos de desarrollo

| Módulo | URL |
|---|---|
| React | `http://localhost:5173` |
| Catálogo y stock | `http://localhost:8081/swagger-ui.html` |
| Pedidos y despacho | `http://localhost:8082/swagger-ui.html` |
| Usuarios / JWT | `http://localhost:8083/swagger-ui.html` |

### Importante

El frontend EP3 se conecta a servicios reales; **no crea usuarios de demostración en el navegador**. El administrador inicial se crea en el backend de usuarios cuando la base está vacía y se establece `ADMIN_PASSWORD` por variable de entorno. Crear vendedor desde administración y cliente desde registro público. **Nunca subir secretos o tokens a GitHub.**

El catálogo oficial proporcionado contiene **51 registros de muestra**, aunque el caso menciona 340 referencias. No se han inventado los restantes productos.

**Estado**: la sintaxis de fuentes JS/JSX fue comprobada, pero no se completó compilación ni prueba E2E en este entorno (sin dependencias offline). Validar MySQL, Swagger, tests y React en tu PC antes de afirmar cumplimiento de toda la rúbrica. El video y las capturas reales están pendientes.

### Código histórico

El texto original de la etapa EP2, que menciona localStorage y credenciales simuladas, se conservó como [README EP2 histórico](documentacion/README_EP2_HISTORICO.md) solo a modo de referencia y **no corresponde a la ejecución EP3**.
