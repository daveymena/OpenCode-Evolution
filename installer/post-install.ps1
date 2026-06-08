$ErrorActionPreference = "Stop"
$ConfigDir = "$env:USERPROFILE\.config\opencode"
$AppConfigDir = "$env:LOCALAPPDATA\OpenCode\config"

Write-Host "[OpenCode Evolution] Configurando entorno..." -ForegroundColor Cyan

# Crear directorio de configuracion
if (-not (Test-Path -LiteralPath $ConfigDir)) {
    New-Item -ItemType Directory -Path $ConfigDir -Force | Out-Null
    Write-Host "  Directorio creado: $ConfigDir" -ForegroundColor Green
}

# Copiar configuracion
if (Test-Path -LiteralPath "$AppConfigDir\opencode.json") {
    Copy-Item -Path "$AppConfigDir\opencode.json" -Destination "$ConfigDir\opencode.json" -Force
    Write-Host "  Configuracion copiada a: $ConfigDir\opencode.json" -ForegroundColor Green
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

# Crear acceso directo en PATH para facil acceso
$OpenCodeDir = "$env:LOCALAPPDATA\OpenCode"
$BinDir = "$OpenCodeDir\bin"
if (-not (Test-Path -LiteralPath $BinDir)) {
    New-Item -ItemType Directory -Path $BinDir -Force | Out-Null
}

$LauncherPath = "$BinDir\opencode-local.cmd"
@"
@echo off
title OpenCode Evolution (Local)
opencode web --hostname 127.0.0.1 --port 3001
pause
"@ | Out-File -FilePath $LauncherPath -Encoding ascii

Write-Host ""
Write-Host "[OpenCode Evolution] Instalacion completada." -ForegroundColor Cyan
Write-Host "  Accesos creados en Menu Inicio y Escritorio" -ForegroundColor Green
Write-Host "  Web Local: http://127.0.0.1:3001" -ForegroundColor Green
Write-Host "  EasyPanel: https://tecnology-opencode-ia.vr7gwz.easypanel.host/" -ForegroundColor Yellow
