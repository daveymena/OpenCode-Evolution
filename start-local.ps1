# OpenCode Evolved - Preview Test Local (PowerShell)

Write-Host "🚀 Iniciando OpenCode Evolved - Preview Test Local" -ForegroundColor Cyan
Write-Host ""

# Verificar que el build existe
if (!(Test-Path "artifacts/opencode-evolved/dist")) {
    Write-Host "❌ Build no encontrado. Ejecutando build..." -ForegroundColor Red
    $env:PORT = "8080"
    $env:BASE_PATH = "/"
    pnpm --filter @workspace/opencode-evolved run build
}

Write-Host "✓ Build encontrado" -ForegroundColor Green
Write-Host ""

# Iniciar el preview server
Write-Host "→ Iniciando Preview Server en puerto 8080..." -ForegroundColor Blue
$env:WORKSPACE = "./test-projects"
$env:PREVIEW_PORT = "8080"
$previewJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    $env:WORKSPACE = "./test-projects"
    $env:PREVIEW_PORT = "8080"
    node preview-server.js
}
Start-Sleep -Seconds 2

if ($previewJob.State -eq "Running") {
    Write-Host "✓ Preview Server corriendo (Job ID: $($previewJob.Id))" -ForegroundColor Green
} else {
    Write-Host "❌ Preview Server falló al iniciar" -ForegroundColor Red
    Stop-Job $previewJob
    Remove-Job $previewJob
    exit 1
}

# Servir el frontend
Write-Host "→ Sirviendo frontend en puerto 3000..." -ForegroundColor Blue
$frontendJob = Start-Job -ScriptBlock {
    Set-Location "$using:PWD/artifacts/opencode-evolved/dist/public"
    python -m http.server 3000
}
Start-Sleep -Seconds 1

if ($frontendJob.State -eq "Running") {
    Write-Host "✓ Frontend corriendo (Job ID: $($frontendJob.Id))" -ForegroundColor Green
} else {
    Write-Host "❌ Frontend falló al iniciar" -ForegroundColor Red
    Stop-Job $previewJob, $frontendJob
    Remove-Job $previewJob, $frontendJob
    exit 1
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "  ✅ OpenCode Evolved está corriendo!" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "  🌐 Frontend:        http://localhost:3000"
Write-Host "  🔍 Preview Server:  http://localhost:8080"
Write-Host "  📁 Workspace:       ./test-projects"
Write-Host ""
Write-Host "  📝 Proyectos de prueba disponibles:"
Write-Host "     • test-projects/react-demo/"
Write-Host "     • test-projects/python-api/"
Write-Host "     • test-projects/html-static/"
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "Presiona Ctrl+C para detener todos los servicios" -ForegroundColor Yellow
Write-Host ""

# Esperar y mostrar logs
try {
    while ($true) {
        Start-Sleep -Seconds 1
        
        # Verificar que los jobs sigan corriendo
        if ($previewJob.State -ne "Running") {
            Write-Host "⚠️ Preview Server se detuvo" -ForegroundColor Yellow
            break
        }
        if ($frontendJob.State -ne "Running") {
            Write-Host "⚠️ Frontend se detuvo" -ForegroundColor Yellow
            break
        }
    }
} finally {
    Write-Host ""
    Write-Host "🛑 Deteniendo servicios..." -ForegroundColor Yellow
    Stop-Job $previewJob, $frontendJob -ErrorAction SilentlyContinue
    Remove-Job $previewJob, $frontendJob -ErrorAction SilentlyContinue
    Write-Host "✓ Servicios detenidos" -ForegroundColor Green
}
