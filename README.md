# Sonido Vivo — Frontend Integrado

Aplicación web desarrollada para la **Tienda Sonido Vivo**, construida con **React + Vite** e integrada a partir de tres módulos principales: **Administrador, Vendedor y Cliente**.

La versión integrada utiliza como base visual el diseño de la rama `feature/admin-gestion`, manteniendo una interfaz general consistente en todo el sistema.

---

## Integrantes y módulos

### Administrador
Responsable de la gestión general del sistema.

Funcionalidades principales:

- Inicio de sesión y control de acceso por rol.
- Dashboard administrativo.
- Gestión de usuarios.
- Activación y desactivación de cuentas.
- Asignación de roles.
- Reportes de ventas.
- Acceso a módulos de vendedor.
- Acceso al catálogo del cliente.

### Vendedor
Responsable de las operaciones asociadas a pedidos e inventario.

Funcionalidades principales:

- Visualización de pedidos.
- Cambio de estado de pedidos:
  - En preparación.
  - Despachado.
  - Entregado.
- Registro de número de seguimiento.
- Filtrado de pedidos por estado.
- Indicadores de pedidos.
- Control y actualización de stock.
- Búsqueda de productos.
- Alertas de stock crítico y productos sin stock.
- Persistencia de datos mediante `localStorage`.
- Mapa interactivo con Leaflet.
- Visualización de tienda y puntos de retiro.

### Cliente
Responsable de la experiencia de compra.

Funcionalidades principales:

- Catálogo de productos.
- Búsqueda y filtros.
- Visualización del detalle de productos.
- Carrito de compras.
- Confirmación de pedido.
- Selección de tipo de entrega.
- Seguimiento de pedidos.
- Integración de pedidos con el módulo vendedor.

---

## Tecnologías utilizadas

- React 19
- Vite
- React Router DOM
- Bootstrap 5
- Leaflet
- React Leaflet
- JavaScript
- HTML5
- CSS3
- Local Storage
- Session Storage
- Vitest
- React Testing Library
- jsdom
- Testing Library User Event
- V8 Coverage

---

## Requisitos

Se recomienda utilizar:

```text
Node.js >= 22.12.0
npm
```

Para comprobar la versión instalada:

```bash
node -v
npm -v
```

---

## Instalación

Clonar o descargar el proyecto y entrar a su carpeta:

```bash
cd ProyectoTiendaSonidoVivo-integrado
```

Instalar dependencias:

```bash
npm install
```

Ejecutar el proyecto en modo desarrollo:

```bash
npm run dev
```

Vite mostrará una dirección similar a:

```text
http://localhost:5173
```

---

## Usuarios de demostración

El proyecto incluye tres usuarios iniciales para probar los distintos roles.

| Rol | Correo | Contraseña |
| --- | --- | --- |
| Administrador | `admin@sonidovivo.cl` | `Sonido2026!` |
| Vendedor | `vendedor@sonidovivo.cl` | `Sonido2026!` |
| Cliente | `cliente@sonidovivo.cl` | `Sonido2026!` |

Cada usuario es redirigido automáticamente a las funciones correspondientes a su rol.

---

## Rutas principales

### Administrador

```text
/admin
/admin/usuarios
/admin/reportes
```

### Vendedor

```text
/vendedor/pedidos
/vendedor/stock
/vendedor/ubicacion
```

### Cliente

```text
/cliente
```

Las rutas se encuentran protegidas según el rol del usuario.

---

## Navegación por roles

### Administrador

Puede acceder a:

- Dashboard.
- Gestión de usuarios.
- Reportes.
- Pedidos.
- Stock.
- Ubicación.
- Catálogo.

### Vendedor

Puede acceder a:

- Pedidos.
- Stock.
- Ubicación.

### Cliente

Puede acceder a:

- Catálogo.
- Carrito.
- Seguimiento de pedidos.

---

## Integración entre módulos

Los módulos fueron integrados en una sola aplicación React.

La estructura general y el estilo visual provienen del módulo de administración.

El sistema utiliza:

- Un solo `AppRouter`.
- Un solo layout principal.
- Rutas protegidas mediante roles.
- Componentes reutilizables.
- Contextos de autenticación y carrito.
- Datos simulados para la evaluación.
- Persistencia local en el navegador.

Los pedidos creados desde el módulo cliente y gestionados desde el módulo vendedor comparten la clave:

```text
sonidoVivo_pedidos
```

en `localStorage`.

Esto permite simular la comunicación entre ambos módulos mientras el proyecto funciona únicamente como frontend.

---

## Estructura principal

```text
src/
├── components/
│   ├── admin/
│   ├── common/
│   ├── ui/
│   └── vendedor/
│
├── context/
│   ├── AuthContext.jsx
│   └── CarritoContext.jsx
│
├── data/
│   ├── admin/
│   ├── pedidos.js
│   ├── productos.json
│   ├── puntosRetiro.js
│   └── usuarios.json
│
├── hooks/
│   └── useStoredData.js
│
├── pages/
│   ├── admin/
│   ├── auth/
│   ├── cliente/
│   ├── common/
│   └── vendedor/
│
├── routes/
│   ├── AppRouter.jsx
│   └── ProtectedRoute.jsx
│
├── services/
│   ├── authService.js
│   ├── bootstrapService.js
│   ├── reportesService.js
│   └── usuariosService.js
│
├── styles/
│   └── app.css
│
├── tests/
│
├── utils/
│
├── App.jsx
└── main.jsx
```

---

## Diseño responsive

La interfaz utiliza Bootstrap y estilos personalizados para adaptarse a diferentes tamaños de pantalla.

Se recomienda validar como mínimo:

```text
Móvil:      360 px o superior
Tablet:     768 px o superior
Escritorio: 1280 px o superior
```

Se han considerado especialmente:

- Navbar y sidebar.
- Tarjetas.
- Formularios.
- Tablas.
- Catálogo.
- Carrito.
- Paneles administrativos.
- Gestión de pedidos.
- Control de stock.
- Mapa Leaflet.

---

## Persistencia

El proyecto utiliza almacenamiento del navegador para simular persistencia sin backend.

### localStorage

Se utiliza para información como:

- Usuarios.
- Pedidos.
- Productos.
- Stock.
- Datos operativos.

### sessionStorage

Se utiliza para mantener la sesión actual del usuario.

La sesión tiene una duración definida dentro del servicio de autenticación.

---

## Testing

El proyecto utiliza:

```text
Vitest
React Testing Library
@testing-library/jest-dom
@testing-library/user-event
jsdom
V8 Coverage
```

Las pruebas cubren los tres roles:

- Administrador.
- Vendedor.
- Cliente.

Se validan, entre otros:

- Autenticación.
- Protección de rutas.
- Gestión de usuarios.
- Reportes.
- Catálogo.
- Detalle de producto.
- Carrito.
- Pedidos.
- Seguimiento.
- Cambio de estados.
- Persistencia.
- Control de stock.
- Renderizado de ubicación.
- Manipulación del DOM.
- Interacciones del usuario.

---

## Ejecutar pruebas

Para ejecutar todas las pruebas una vez:

```bash
npm test
```

Para ejecutar Vitest en modo observación:

```bash
npm run test:watch
```

Para generar cobertura:

```bash
npm run test:coverage
```

---

## Compilar para producción

Antes de entregar el proyecto:

```bash
npm run build
```

Si la compilación termina correctamente, Vite generará la carpeta:

```text
dist/
```

Esta carpeta no debe subirse al repositorio si se mantiene excluida mediante `.gitignore`.

Para visualizar la compilación:

```bash
npm run preview
```

---

## Validación recomendada antes de entregar

Ejecutar:

```bash
npm install
npm test
npm run build
```

Luego probar manualmente los tres usuarios de demostración.

También se recomienda revisar:

```bash
git status
```

y verificar que no se estén incluyendo archivos innecesarios.

---

## Archivos que no deben subirse a GitHub

El proyecto debe mantener fuera del repositorio:

```text
node_modules/
dist/
coverage/
.env
.env.local
```

---

## Flujo Git recomendado

Las ramas utilizadas durante el desarrollo fueron:

```text
feature/admin-gestion
feature/vendedor-pedidos
feature/cliente-catalogo
```

Para la integración completa se recomienda trabajar desde una rama como:

```text
integration/sonido-vivo-completo
```

Ejemplo:

```bash
git checkout -b integration/sonido-vivo-completo
git add .
git commit -m "merge: integra modulos admin cliente y vendedor"
git push -u origin integration/sonido-vivo-completo
```

Una vez validada la versión final, puede integrarse a `main`.

---

## Consideraciones académicas

Este proyecto corresponde a una aplicación frontend desarrollada con fines académicos.

Los datos utilizados son simulados y permiten demostrar:

- Componentización con React.
- Uso de props y estados.
- Navegación SPA.
- Protección de rutas.
- Diseño responsive.
- Manejo de formularios.
- Persistencia local.
- Integración de mapas.
- Testing unitario.
- Integración de módulos desarrollados por distintos integrantes.

---

## Proyecto Sonido Vivo

Aplicación frontend integrada para la gestión de una tienda de instrumentos y equipamiento musical, desarrollada como parte de la evaluación de Desarrollo FullStack II.
