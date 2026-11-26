# Sonido Vivo — Fullstack II — EP3 (Forma B)

Proyecto académico integrado: React + Vite, tres microservicios Spring Boot, MySQL y autenticación JWT.

## Documentos principales

- [Ejecución e integración](documentacion/INTEGRACION_EP3.md) — **leer primero**; incluye puertos, SQL, variables y endpoints.
- [Cambios aplicados al ZIP](documentacion/CAMBIOS_REALIZADOS.md).
- [Manual de usuario EP3](documentacion/Sonido_Vivo_EP3_Manual_Usuario_11_Capturas.pdf) — manual completo en PDF, con 11 capturas reales de los módulos cliente, vendedor y administrador.
- [Plan de pruebas y aceptación EP3](documentacion/PRUEBAS_EP3.md) — resultados de pruebas ejecutadas y verificaciones pendientes.

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

**Estado EP3 (24-11-2026):**
- Frontend React: 107 de 107 pruebas aprobadas.
- Compilación React: BUILD SUCCESS.
- Microservicio catálogo: pruebas Maven aprobadas (BUILD SUCCESS).
- Microservicio pedidos: 9 de 9 pruebas aprobadas.
- Microservicio usuarios y autenticación: pruebas Maven aprobadas (BUILD SUCCESS).
- Integración React, Spring Boot y MySQL: comprobada mediante pruebas funcionales.

### Código histórico

El texto original de la etapa EP2, que menciona localStorage y credenciales simuladas, se conservó como [README EP2 histórico](documentacion/README_EP2_HISTORICO.md) solo a modo de referencia y **no corresponde a la ejecución EP3**.
