# Integración frontend React — EP3

## Instalación

1. Levantar los tres Spring Boot, preparar sus bases MySQL y compartir `JWT_SECRET` según `../documentacion/INTEGRACION_EP3.md`.
2. Copiar `.env.example` a `.env.local` (solo URL, sin secretos).
3. Ejecutar `npm ci` y `npm run dev` con Node 22 o superior.
4. Abrir `http://localhost:5173/login`.

## Servicios consultados

- `src/services/authService.js` y `api.js`: JWT emitido por 8083, restauración con `/api/auth/me`, sesión en `sessionStorage`, limpieza ante vencimiento/401.
- `usuariosService.js`: gestión real de usuarios con 8083 (solo ADMIN).
- `catalogoService.js`: productos y ajuste de inventario desde 8081.
- `pedidosService.js`: crear, listar, seguir y actualizar pedidos con 8082.
- `reportesService.js`: estadísticas de pedidos confirmados; no certifica pagos.

Las muestras de `src/data/` se mantienen como materiales EP2 y para pruebas anteriores, pero **las vistas EP3 usan las API reales**. El carrito pendiente se mantiene temporalmente en la memoria React.

## Validación

```
npm run test:ep3   # pruebas de adaptadores HTTP con fetch simulado
npm test           # conjunto completo; tests heredados de EP2 pueden requerir migración
npm run build
```

La compilación de frontend y las pruebas de integración real **no se ejecutaron en la preparación de este ZIP** porque no estaban disponibles las dependencias npm. Registra resultados de tu PC en `../documentacion/PRUEBAS_EP3.md`.
