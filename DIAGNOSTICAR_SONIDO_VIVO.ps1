# Sonido Vivo EP3 - diagnostico local de puertos y Swagger.
# Solo consulta HTTP y TCP; no lee ni muestra contraseñas o JWT.
$ErrorActionPreference = 'Stop'
$targets = @(
    @{ Name = 'Catálogo'; Port = 8081; Path = '/v3/api-docs' },
    @{ Name = 'Pedidos'; Port = 8082; Path = '/v3/api-docs' },
    @{ Name = 'Usuarios'; Port = 8083; Path = '/v3/api-docs' },
    @{ Name = 'Frontend React'; Port = 5173; Path = '/' }
)
Write-Host ''
Write-Host 'SONIDO VIVO EP3 - DIAGNÓSTICO DE SERVICIOS' -ForegroundColor Cyan
Write-Host '================================================'
foreach ($target in $targets) {
    $url = 'http://localhost:' + $target.Port + $target.Path
    Write-Host ('Probando {0} : {1}' -f $target.Name, $url)
    try {
        $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 8
        if ($target.Port -ne 5173 -and $response.Content -notmatch '"openapi"') {
            Write-Host '  ADVERTENCIA: HTTP 200, pero no devolvió un documento OpenAPI JSON.' -ForegroundColor Yellow
        } else {
            Write-Host '  OK: HTTP 200' -ForegroundColor Green
        }
    }
    catch {
        $status = $null
        if ($_.Exception.Response) {
            try { $status = [int]$_.Exception.Response.StatusCode } catch {}
        }
        if ($status) {
            Write-Host ('  ERROR: HTTP {0}' -f $status) -ForegroundColor Red
            if ($status -eq 401 -or $status -eq 403) { Write-Host '  Las rutas de Swagger deberian ser publicas: comprueba SecurityConfig.' }
            if ($status -eq 404) { Write-Host '  El servidor responde, pero no encuentra /v3/api-docs. Revisa dependencias springdoc y logs.' }
            if ($status -ge 500) { Write-Host '  El servidor responde con error. Revisa las excepciones en su terminal.' }
        }
        else {
            Write-Host '  SIN CONEXION: el servicio no escucha o no terminó de arrancar.' -ForegroundColor Red
            Write-Host ('  Revisa la ventana de {0}: busca [ERROR], BUILD FAILURE, Access denied o Communications link failure.' -f $target.Name)
        }
    }
}
Write-Host ''
$hostMySQL = $env:MYSQL_HOST
if (-not $hostMySQL) { $hostMySQL = '127.0.0.1' }
$portMySQL = 3307
if ($env:MYSQL_PORT) { $portMySQL = [int]$env:MYSQL_PORT }
Write-Host ('MySQL: comprobando TCP {0}:{1}' -f $hostMySQL, $portMySQL)
$tcp = New-Object System.Net.Sockets.TcpClient
try {
    $result = $tcp.BeginConnect($hostMySQL, $portMySQL, $null, $null)
    if (-not $result.AsyncWaitHandle.WaitOne(2500)) { throw 'Tiempo de conexión agotado' }
    $tcp.EndConnect($result)
    Write-Host '  OK: puerto MySQL accesible (NO confirma credenciales ni tablas).' -ForegroundColor Green
}
catch {
    Write-Host '  ERROR: MySQL no escucha en ese puerto. Verifica XAMPP y config.local.bat.' -ForegroundColor Red
}
finally { $tcp.Close() }
Write-Host ''
Write-Host 'Si Swagger no abre, abre la ventana del microservicio y copia las últimas líneas del error (sin claves).' -ForegroundColor Yellow
Write-Host 'Base de datos esperadas: sonidovivo_usuarios, sonido_vivo_catalogo, sonido_vivo_pedidos.'
Write-Host 'Importa los tres scripts de database/ usando phpMyAdmin si aún no lo hiciste.'
