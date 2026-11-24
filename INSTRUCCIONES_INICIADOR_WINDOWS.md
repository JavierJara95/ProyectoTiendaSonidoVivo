# Iniciar Sonido Vivo EP3 en Windows

En la carpeta principal del proyecto, haz doble clic en **`INICIAR_SONIDO_VIVO.bat`**. Se abriran cuatro ventanas: **ms-usuarios-auth (8083)**, **ms-catalogo (8081)**, **ms-pedidos (8082)** y **React/Vite (5173)**.

## Antes de iniciar la primera vez

1. Descomprime **todo** el ZIP; no ejecutes el .bat dentro de la vista comprimida.
2. Instala **JDK 21**, **Node.js 22.12+**, npm y MySQL (por ejemplo XAMPP). La primera ejecucion de Maven/Node necesita Internet para descargar dependencias.
3. Importa los scripts `database/01_schema_usuarios.sql`, `database/02_schema_catalogo.sql` y `database/03_schema_pedidos.sql` en MySQL **antes** de iniciar. El .bat **no** crea ni modifica las bases de datos.
4. El puerto MySQL por defecto es **3307**. Si utilizas 3306, copia `config.local.ejemplo.bat` como `config.local.bat` en la raiz del proyecto y cambia `MYSQL_PORT=3306`. En ese archivo puedes configurar `DB_USERNAME`, `DB_PASSWORD` y `XAMPP_DIR` si corresponde.
5. Haz doble clic en el .bat. Si MySQL no responde, intentara iniciar `mysql_start.bat` si encuentra XAMPP en `C:\xampp` o en `XAMPP_DIR`. Si no se inicia, abre el panel XAMPP manualmente y arranca MySQL.
6. Al iniciar, solicita de forma oculta la contrasena inicial del administrador (solo necesaria para crear el primer usuario en una base vacia). Debe tener **minimo ocho caracteres, mayuscula, minuscula y numero**. **El JWT_SECRET se genera aleatoriamente en cada ejecucion** si no has definido uno propio y se comparte en las cuatro ventanas. Por ello, los JWT anteriores dejan de ser validos tras reiniciar; vuelve a iniciar sesion.
7. Si no existe `frontend/.env.local`, el .bat copia `frontend/.env.example`. Si faltan dependencias frontend ejecuta `npm ci`. Los 3 backends arrancan con su propio `mvnw.cmd`.
8. Abre `http://localhost:5173` cuando Vite muestre que esta listo. El primer arranque de Maven puede tardar debido a la descarga de dependencias.

## URLs

- React: http://localhost:5173
- Swagger catalogo: http://localhost:8081/swagger-ui.html
- Swagger pedidos: http://localhost:8082/swagger-ui.html
- Swagger usuarios: http://localhost:8083/swagger-ui.html

Para detener, en cada ventana de servicio pulsa `Ctrl + C` y confirma el cierre si Windows lo solicita. No basta con cerrar la ventana del lanzador principal.

## Notas tecnicas

- **No publiques** `config.local.bat`: un `.gitignore` de raiz lo excluye. No pongas claves reales en `config.local.ejemplo.bat`.
- El lanzador transmite variables por entorno a cada ventana, y construye `DB_URL` **independiente por microservicio** para las bases `sonido_vivo_catalogo`, `sonido_vivo_pedidos` y `sonidovivo_usuarios`.
- Si ya ocupas 8081, 8082, 8083 o 5173, el .bat detiene el lanzamiento para evitar conflictos; cierra las instancias previas.
- El .bat comprueba que el puerto MySQL este escuchando, **no** que las tablas ya existan ni que el acceso de usuario/clave sea valido. Los errores de conexion y esquema se veran en la ventana Spring correspondiente.
- Si `npm ci` o `mvnw.cmd` fallan, comprueba la conexion de Internet, la version de Java y las variables locales. El lanzador no sustituye las pruebas de integracion y rubrica EP3.
- **Importante:** el inicio automatico en Windows no se ha probado en una instalacion real de Windows/XAMPP en este entorno; el archivo esta preparado para ejecutarse ahi, pero es necesario validar en tu PC.
