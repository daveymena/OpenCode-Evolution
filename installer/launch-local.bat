@echo off
title OpenCode Evolution - Local
chcp 65001 >nul

echo [OpenCode Evolution] Iniciando servidor local...
echo.
echo Abre tu navegador en: http://127.0.0.1:3001
echo.
echo Para salir, presiona Ctrl+C
echo.

opencode web --hostname 127.0.0.1 --port 3001

echo.
echo Servidor detenido.
pause
