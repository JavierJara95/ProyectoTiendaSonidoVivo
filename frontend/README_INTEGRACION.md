# Sonido Vivo — Integración de las 3 ramas

Base visual y estructural: `feature/admin-gestion`.

## Integrado

- Administración y autenticación desde `feature/admin-gestion`.
- Catálogo, detalle, carrito, confirmación y seguimiento desde `feature/cliente-catalogo`.
- Gestión de pedidos, stock y mapa Leaflet desde `feature/vendedor-pedidos`.
- Un solo `AppRouter` con rutas protegidas por rol.
- Un solo `Layout` (sidebar, topbar y footer) usando el estilo de admin-gestion.
- Navegación por rol:
  - Admin: resumen, usuarios, reportes, pedidos, stock, ubicación y catálogo.
  - Vendedor: pedidos, stock y ubicación.
  - Cliente: catálogo, carrito y seguimiento.
- Los pedidos del cliente y vendedor comparten la clave `sonidoVivo_pedidos` en `localStorage`.
- Los iconos de la interfaz son componentes SVG locales en React (`src/components/ui/Icons.jsx`), evitando depender de `lucide-react`.

## Instalación

```bash
npm install
npm run dev
```

## Validación antes de subir

```bash
npm test
npm run build
```

## Git recomendado

Crear una rama de integración desde esta versión:

```bash
git checkout -b integration/sonido-vivo-completo
git add .
git commit -m "merge: integra modulos admin cliente y vendedor"
git push -u origin integration/sonido-vivo-completo
```

Cuando el equipo confirme que funciona, se puede integrar esa rama a `main` localmente o por Pull Request.

## Archivos que no deben subirse

- `node_modules/`
- `dist/`
- `coverage/`
