$ErrorActionPreference = "Stop"
$ConfigDir = "$env:USERPROFILE\.config\opencode"
$AppConfigDir = "$env:LOCALAPPDATA\OpenCode\config"
$SaaSConfigDir = "$env:USERPROFILE\.config\opencode-saas"

Write-Host "[OpenCode Evolution] Configurando entorno..." -ForegroundColor Cyan

# Crear directorio de configuracion
if (-not (Test-Path -LiteralPath $ConfigDir)) {
    New-Item -ItemType Directory -Path $ConfigDir -Force | Out-Null
}

# Copiar configuracion
if (Test-Path -LiteralPath "$AppConfigDir\opencode.json") {
    Copy-Item -Path "$AppConfigDir\opencode.json" -Destination "$ConfigDir\opencode.json" -Force
}

# Instalar/actualizar opencode-ai globalmente
Write-Host "  Instalando opencode-ai (npm global)..." -ForegroundColor Yellow
try {
    $npmOutput = npm install -g opencode-ai --force 2>&1
    Write-Host "  opencode-ai instalado correctamente" -ForegroundColor Green
} catch {
    Write-Host "  ADVERTENCIA: No se pudo instalar opencode-ai. Verifica que Node.js este instalado." -ForegroundColor Red
    Write-Host "  Descarga Node.js desde: https://nodejs.org/" -ForegroundColor Yellow
}

# Verificar instalacion
try {
    $version = opencode --version 2>&1
    Write-Host "  OpenCode version: $version" -ForegroundColor Green
} catch {
    Write-Host "  ADVERTENCIA: opencode no esta en PATH. Abre una nueva terminal." -ForegroundColor Yellow
}

# Crear acceso directo en PATH
$OpenCodeDir = "$env:LOCALAPPDATA\OpenCode"
$BinDir = "$OpenCodeDir\bin"
if (-not (Test-Path -LiteralPath $BinDir)) {
    New-Item -ItemType Directory -Path $BinDir -Force | Out-Null
}

# --- Scripts de conexion SaaS ---

# 1. Conectar al servidor EasyPanel (web)
$LauncherEasy = "$BinDir\opencode-easypanel.cmd"
@"
@echo off
title OpenCode Evolution - EasyPanel Server
start "" "https://tecnology-opencode-ia.vr7gwz.easypanel.host/"
echo Navegador abierto hacia EasyPanel
pause
"@ | Out-File -FilePath $LauncherEasy -Encoding ascii

# 2. Conectar via opencode attach (CLI remota)
$LauncherAttach = "$BinDir\opencode-attach.cmd"
@"
@echo off
title OpenCode Evolution - Conexion Remota
set /p USERNAME="Usuario: "
set /p PASSWORD="Password: "
opencode attach https://tecnology-opencode-ia.vr7gwz.easypanel.host/ --username %USERNAME% --password %PASSWORD%
pause
"@ | Out-File -FilePath $LauncherAttach -Encoding ascii

# 3. Iniciar instancia local (datos propios)
$LauncherLocal = "$BinDir\opencode-local.cmd"
@"
@echo off
title OpenCode Evolution (Local - %USERNAME%)
set /p USERNAME="Tu nombre de usuario: "
set OPENCODE_APPNAME=opencode-%USERNAME%
opencode web --hostname 127.0.0.1 --port 3001
pause
"@ | Out-File -FilePath $LauncherLocal -Encoding ascii

# 4. Guia rapida en el escritorio
$Desktop = [Environment]::GetFolderPath("Desktop")
$GuidePath = "$Desktop\GUIA_OpenCode_Evolution.txt"
@"
=====================================
 OPENCODE EVOLUTION - GUIA RAPIDA
=====================================

1. CONEXION A EASYPANEL (SaaS)
   Abre tu navegador en:
   https://tecnology-opencode-ia.vr7gwz.easypanel.host/

   Cada usuario tiene su propio puerto:
   - admin: puerto 3001
   - (tu usuario): puerto asignado

2. INSTANCIA LOCAL (datos aislados)
   Ejecuta en terminal:
   set OPENCODE_APPNAME=opencode-TU_USUARIO
   opencode web --hostname 127.0.0.1 --port 3001

   Esto crea datos separados para cada usuario.

3. CONEXION REMOTA (CLI)
   opencode attach https://tecnology-opencode-ia.vr7gwz.easypanel.host/ --username TU_USUARIO --password TU_PASS

4. PERFILES MULTIPLES (SaaS)
   set OPENCODE_APPNAME=opencode-trabajo
   opencode web --port 3002

   set OPENCODE_APPNAME=opencode-personal
   opencode web --port 3003

=====================================
"@ | Out-File -FilePath $GuidePath -Encoding utf8

Write-Host ""
Write-Host "[OpenCode Evolution] Instalacion completada." -ForegroundColor Cyan
Write-Host "  Accesos creados en Menu Inicio y Escritorio" -ForegroundColor Green
Write-Host ""
Write-Host "  CONEXIONES DISPONIBLES:" -ForegroundColor Yellow
Write-Host "  Web (EasyPanel): https://tecnology-opencode-ia.vr7gwz.easypanel.host/" -ForegroundColor Green
Write-Host "  Local (tu PC):   http://127.0.0.1:3001 (datos aislados por usuario)" -ForegroundColor Green
Write-Host "  CLI Remota:      opencode attach <url> --username <user> --password <pass>" -ForegroundColor Green
Write-Host ""
Write-Host "  TIP: Usa OPENCODE_APPNAME=opencode-TU_NOMBRE para tener datos separados" -ForegroundColor Cyan
Write-Host "  Guia rapida creada en el Escritorio: GUIA_OpenCode_Evolution.txt" -ForegroundColor Cyan