@echo off
setlocal
cd /d "%~dp0"
if exist "%~dp0config.local.bat" call "%~dp0config.local.bat"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0DIAGNOSTICAR_SONIDO_VIVO.ps1"
echo.
pause
