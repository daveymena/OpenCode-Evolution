@echo off
title OpenCode Evolution - EasyPanel Server
chcp 65001 >nul

:: ============================================
:: EasyPanel Server URL
:: ============================================
set EASYPANEL_URL=https://tecnology-opencode-ia.vr7gwz.easypanel.host/
:: ============================================

echo [OpenCode Evolution] Conectando a EasyPanel...
echo Servidor: %EASYPANEL_URL%
echo.
start "" "%EASYPANEL_URL%"
echo Navegador abierto. Si no se conecta, verifica la IP del servidor.
pause
