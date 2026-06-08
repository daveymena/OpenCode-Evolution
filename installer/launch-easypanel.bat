@echo off
title OpenCode Evolution - EasyPanel Server
chcp 65001 >nul

:: ============================================
:: EasyPanel Server URL (SaaS Multi-tenant)
:: ============================================
set EASYPANEL_URL=https://tecnology-opencode-ia.vr7gwz.easypanel.host/
:: ============================================

echo [OpenCode Evolution] Conectando a EasyPanel...
echo Servidor: %EASYPANEL_URL%
echo.
echo Usuarios disponibles:
echo   admin - Puerto 3001
echo   (solicita tu usuario al administrador)
echo.
echo Tus datos estan aislados por usuario.
echo.
start "" "%EASYPANEL_URL%"
echo Navegador abierto.
pause
