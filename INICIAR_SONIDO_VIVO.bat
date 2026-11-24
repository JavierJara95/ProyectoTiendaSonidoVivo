@echo off
setlocal EnableExtensions DisableDelayedExpansion

rem Lanzador de Sonido Vivo EP3 (Windows). Ejecutar con doble clic.
rem El mismo archivo abre 4 ventanas: 3 Spring Boot + 1 Vite.
if /I "%~1"=="__backend" goto :run_backend
if /I "%~1"=="__frontend" goto :run_frontend

set "ROOT=%~dp0"
title Sonido Vivo EP3 - Iniciador
cd /d "%ROOT%" || goto :fallo

echo ============================================================
echo               SONIDO VIVO EP3 - INICIADOR
echo ============================================================
echo.
echo Carpeta: "%ROOT%"
echo.

if not exist "%ROOT%backend\ms-catalogo\mvnw.cmd" goto :estructura
if not exist "%ROOT%backend\ms-pedidos\mvnw.cmd" goto :estructura
if not exist "%ROOT%backend\ms-usuarios-auth\mvnw.cmd" goto :estructura
if not exist "%ROOT%frontend\package.json" goto :estructura

rem Configuracion opcional: no se incluye dentro del ZIP ni debe subirse a Git.
if exist "%ROOT%config.local.bat" (
  echo Cargando configuracion local...
  call "%ROOT%config.local.bat"
)
if not defined MYSQL_HOST set "MYSQL_HOST=127.0.0.1"
if not defined MYSQL_PORT set "MYSQL_PORT=3307"
if not defined DB_USERNAME set "DB_USERNAME=root"
if not defined CATALOGO_URL set "CATALOGO_URL=http://localhost:8081"

where java >nul 2>&1
if errorlevel 1 (
  echo [ERROR] No se encontro Java en PATH. Instala JDK 21 y configura JAVA_HOME.
  goto :fallo
)
where node >nul 2>&1
if errorlevel 1 (
  echo [ERROR] No se encontro Node.js. Se requiere Node 22.12 o superior.
  goto :fallo
)
where npm.cmd >nul 2>&1
if errorlevel 1 (
  echo [ERROR] No se encontro npm. Reinstala Node.js con npm.
  goto :fallo
)
where powershell.exe >nul 2>&1
if errorlevel 1 (
  echo [ERROR] No se encontro PowerShell. Es necesario en este iniciador.
  goto :fallo
)

echo [OK] Java disponible:
java -version 2>&1
echo.
echo [OK] Node y npm disponibles:
call node --version
call npm.cmd --version
echo.

rem Un solo JWT secreto para los 3 procesos. Se crea aleatoriamente por ejecucion.
if not defined JWT_SECRET call :generate_jwt
if not defined JWT_SECRET (
  echo [ERROR] No se pudo generar JWT_SECRET.
  goto :fallo
)
if not defined ADMIN_PASSWORD call :ask_admin
if not defined ADMIN_PASSWORD (
  echo [ERROR] ADMIN_PASSWORD es obligatorio para crear el primer administrador.
  goto :fallo
)

echo Comprobando MySQL en %MYSQL_HOST%:%MYSQL_PORT% ...
call :mysql_available
if errorlevel 1 (
  echo MySQL no responde. Buscando XAMPP para intentar iniciarlo...
  call :try_start_mysql
  if errorlevel 1 (
    echo [ERROR] No se pudo detectar MySQL en %MYSQL_HOST%:%MYSQL_PORT%.
    echo Inicia MySQL en XAMPP y confirma el puerto configurado.
    echo Si usas otro puerto, cambia MYSQL_PORT en config.local.bat.
    goto :fallo
  )
)
echo [OK] MySQL esta escuchando en %MYSQL_HOST%:%MYSQL_PORT%.
echo IMPORTANTE: Las tres bases de datos deben estar importadas.
echo.

echo Verificando que los puertos de la aplicacion esten libres...
call :check_ports
if errorlevel 1 (
  echo [ERROR] Cierra el servicio que ocupa esos puertos antes de iniciar.
  goto :fallo
)

if not exist "%ROOT%frontend\.env.local" (
  echo Creando frontend\.env.local a partir del archivo de ejemplo...
  copy /Y "%ROOT%frontend\.env.example" "%ROOT%frontend\.env.local" >nul
  if errorlevel 1 goto :fallo
)

if not exist "%ROOT%frontend\node_modules\.bin\vite.cmd" (
  echo [INFO] Instalando dependencias del frontend con npm ci...
  pushd "%ROOT%frontend" || goto :fallo
  call npm.cmd ci
  if errorlevel 1 (
    popd
    echo [ERROR] Fallo npm ci. Revisa tu conexion a Internet.
    goto :fallo
  )
  popd
)

echo [1/4] Iniciando usuarios / JWT (8083)...
start "Sonido Vivo - Usuarios 8083" /D "%ROOT%" cmd /k ""%~f0" __backend ms-usuarios-auth sonidovivo_usuarios 8083"
echo [2/4] Iniciando catalogo (8081)...
start "Sonido Vivo - Catalogo 8081" /D "%ROOT%" cmd /k ""%~f0" __backend ms-catalogo sonido_vivo_catalogo 8081"
echo [3/4] Iniciando pedidos (8082)...
start "Sonido Vivo - Pedidos 8082" /D "%ROOT%" cmd /k ""%~f0" __backend ms-pedidos sonido_vivo_pedidos 8082"
echo [4/4] Iniciando React / Vite (5173)...
start "Sonido Vivo - React 5173" /D "%ROOT%" cmd /k ""%~f0" __frontend"

echo.
echo Se abrieron 4 ventanas. Espera a que cada una indique que inicio.
echo Si una ventana falla, lee el mensaje de error en esa ventana.
echo.
echo React:    http://localhost:5173
 echo Catalogo: http://localhost:8081/swagger-ui.html
 echo Pedidos:  http://localhost:8082/swagger-ui.html
 echo Usuarios: http://localhost:8083/swagger-ui.html
 echo.
echo Cierra las ventanas de cada servicio para detenerlos.
echo Este lanzador NO importa SQL ni sustituye las pruebas de integracion.
echo.
echo Cuando las 4 terminales indiquen que iniciaron, presiona una tecla
 echo para COMPROBAR automaticamente los tres Swagger y React.
pause
call "%ROOT%DIAGNOSTICAR_SONIDO_VIVO.bat"
exit /b 0

:generate_jwt
for /f "usebackq delims=" %%K in (`powershell -NoProfile -Command "$b = New-Object byte[] 32; $r = [System.Security.Cryptography.RandomNumberGenerator]::Create(); $r.GetBytes($b); $r.Dispose(); [Convert]::ToBase64String($b)"`) do set "JWT_SECRET=%%K"
exit /b 0

:ask_admin
echo Necesitas la clave del administrador inicial para una base nueva.
echo Si la cuenta admin ya existe, puedes ingresar una clave de prueba local.
echo No se mostrara la clave mientras la escribes.
for /f "usebackq delims=" %%P in (`powershell -NoProfile -Command "$s = Read-Host 'Clave admin (min. 8 caracteres, mayuscula, minuscula y numero)' -AsSecureString; [System.Net.NetworkCredential]::new('', $s).Password"`) do set "ADMIN_PASSWORD=%%P"
exit /b 0

:mysql_available
powershell -NoProfile -Command "try { $c = New-Object System.Net.Sockets.TcpClient; $r = $c.BeginConnect('%MYSQL_HOST%', %MYSQL_PORT%, $null, $null); if (-not $r.AsyncWaitHandle.WaitOne(2000)) { exit 1 }; $c.EndConnect($r); $c.Close(); exit 0 } catch { exit 1 }" >nul 2>&1
exit /b %errorlevel%

:try_start_mysql
set "XAMPP_START="
if defined XAMPP_DIR if exist "%XAMPP_DIR%\mysql_start.bat" set "XAMPP_START=%XAMPP_DIR%\mysql_start.bat"
if not defined XAMPP_START if exist "C:\xampp\mysql_start.bat" set "XAMPP_START=C:\xampp\mysql_start.bat"
if not defined XAMPP_START exit /b 1
for %%D in ("%XAMPP_START%") do set "XAMPP_HOME=%%~dpD"
echo [INFO] Intentando iniciar MySQL con XAMPP: "%XAMPP_HOME%"
start "Sonido Vivo - MySQL XAMPP" /D "%XAMPP_HOME%" cmd /k "call mysql_start.bat"
for /L %%I in (1,1,10) do (
  timeout /t 2 /nobreak >nul
  call :mysql_available
  if not errorlevel 1 exit /b 0
)
exit /b 1

:check_ports
powershell -NoProfile -Command "$ports = @(8081,8082,8083,5173); $used = @(Get-NetTCPConnection -State Listen -ErrorAction SilentlyContinue | Where-Object { $ports -contains $_.LocalPort } | Select-Object -ExpandProperty LocalPort -Unique); if ($used.Count -gt 0) { Write-Host ('[ERROR] Puertos ocupados: ' + ($used -join ', ')); exit 1 }"
exit /b %errorlevel%

:run_backend
set "ROOT=%~dp0"
set "SERVICE=%~2"
set "DB_NAME=%~3"
set "SERVER_PORT=%~4"
if not defined MYSQL_HOST set "MYSQL_HOST=127.0.0.1"
if not defined MYSQL_PORT set "MYSQL_PORT=3307"
if not defined DB_USERNAME set "DB_USERNAME=root"
set "DB_USER=%DB_USERNAME%"
set "DB_URL=jdbc:mysql://%MYSQL_HOST%:%MYSQL_PORT%/%DB_NAME%?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=America/Santiago"
cd /d "%ROOT%backend\%SERVICE%" || goto :fallo
 echo ============================================================
 echo Iniciando %SERVICE%  -  puerto %SERVER_PORT%
 echo Base de datos: %DB_NAME%
 echo ============================================================
call mvnw.cmd spring-boot:run
if errorlevel 1 echo [ERROR] %SERVICE% se detuvo con error. Revisa las lineas anteriores.
pause
exit /b 0

:run_frontend
set "ROOT=%~dp0"
cd /d "%ROOT%frontend" || goto :fallo
 echo ============================================================
 echo Iniciando React/Vite en http://localhost:5173
 echo ============================================================
call npm.cmd run dev -- --host 127.0.0.1 --port 5173 --strictPort
if errorlevel 1 echo [ERROR] React/Vite se detuvo con error.
pause
exit /b 0

:estructura
echo [ERROR] Estructura incompleta. Extrae TODO el ZIP antes de ejecutar.
goto :fallo

:fallo
echo.
echo No se iniciaron todos los servicios. Revisa los mensajes anteriores.
pause
exit /b 1
