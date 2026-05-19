# Test Completo del Sistema OpenCode Evolved
# Este script prueba toda la integración

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "  🧪 Test Completo - OpenCode Evolved" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

# Variables
$API_PORT = 3001
$FRONTEND_PORT = 3000
$PREVIEW_PORT = 8080

# Función para verificar si un puerto está en uso
function Test-Port {
    param($Port)
    try {
        $connection = New-Object System.Net.Sockets.TcpClient("localhost", $Port)
        $connection.Close()
        return $true
    } catch {
        return $false
    }
}

# Limpiar puertos si están en uso
Write-Host "🧹 Limpiando puertos..." -ForegroundColor Yellow
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Get-Process -Name python -ErrorAction SilentlyContinue | Where-Object {$_.CommandLine -like "*http.server*"} | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# 1. Iniciar API Server
Write-Host ""
Write-Host "1️⃣  Iniciando API Server..." -ForegroundColor Blue
$env:PORT = $API_PORT
$env:DATABASE_URL = "file:./dev.db"
$apiJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    $env:PORT = $using:API_PORT
    $env:DATABASE_URL = "file:./dev.db"
    cd artifacts/api-server
    node dist/index.mjs
}
Start-Sleep -Seconds 3

if ($apiJob.State -eq "Running") {
    Write-Host "   ✅ API Server corriendo en puerto $API_PORT" -ForegroundColor Green
} else {
    Write-Host "   ❌ API Server falló al iniciar" -ForegroundColor Red
    Receive-Job $apiJob
    exit 1
}

# 2. Probar API Server
Write-Host ""
Write-Host "2️⃣  Probando API Server..." -ForegroundColor Blue
Start-Sleep -Seconds 2

try {
    $health = Invoke-RestMethod -Uri "http://localhost:$API_PORT/api/health" -Method Get
    Write-Host "   ✅ Health check: $($health.status)" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Health check falló: $_" -ForegroundColor Red
    Stop-Job $apiJob
    Remove-Job $apiJob
    exit 1
}

# 3. Probar endpoint de ejecución
Write-Host ""
Write-Host "3️⃣  Probando endpoint de ejecución..." -ForegroundColor Blue

# Crear un proyecto de prueba simple
$testProjectPath = "./test-projects/html-static"
if (Test-Path $testProjectPath) {
    try {
        $body = @{
            projectPath = $testProjectPath
        } | ConvertTo-Json

        $result = Invoke-RestMethod -Uri "http://localhost:$API_PORT/api/execute/run" `
            -Method Post `
            -ContentType "application/json" `
            -Body $body

        Write-Host "   ✅ Proyecto detectado: $($result.type)" -ForegroundColor Green
        Write-Host "   ✅ URL: $($result.url)" -ForegroundColor Green
        Write-Host "   ✅ Puerto: $($result.port)" -ForegroundColor Green
    } catch {
        Write-Host "   ⚠️  Endpoint de ejecución: $_" -ForegroundColor Yellow
    }
}

# 4. Iniciar Frontend (si está compilado)
Write-Host ""
Write-Host "4️⃣  Iniciando Frontend..." -ForegroundColor Blue

if (Test-Path "artifacts/opencode-evolved/dist/public") {
    $frontendJob = Start-Job -ScriptBlock {
        Set-Location "$using:PWD/artifacts/opencode-evolved/dist/public"
        python -m http.server $using:FRONTEND_PORT
    }
    Start-Sleep -Seconds 2

    if ($frontendJob.State -eq "Running") {
        Write-Host "   ✅ Frontend corriendo en puerto $FRONTEND_PORT" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Frontend no pudo iniciar" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ⚠️  Frontend no compilado. Ejecuta: pnpm --filter @workspace/opencode-evolved run build" -ForegroundColor Yellow
}

# 5. Resumen
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "  ✅ Sistema Iniciado" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "  🌐 URLs de Acceso:" -ForegroundColor White
Write-Host "     • API Server:    http://localhost:$API_PORT" -ForegroundColor Cyan
Write-Host "     • Frontend:      http://localhost:$FRONTEND_PORT" -ForegroundColor Cyan
Write-Host "     • API Health:    http://localhost:$API_PORT/api/health" -ForegroundColor Cyan
Write-Host ""
Write-Host "  📡 Endpoints Disponibles:" -ForegroundColor White
Write-Host "     • POST /api/execute/run      - Ejecutar proyecto" -ForegroundColor Gray
Write-Host "     • GET  /api/execute/status   - Ver estado" -ForegroundColor Gray
Write-Host "     • GET  /api/execute/logs     - Ver logs" -ForegroundColor Gray
Write-Host "     • POST /api/execute/stop     - Detener proyecto" -ForegroundColor Gray
Write-Host ""
Write-Host "  🧪 Pruebas Disponibles:" -ForegroundColor White
Write-Host "     • test-projects/react-demo/   - App React" -ForegroundColor Gray
Write-Host "     • test-projects/python-api/   - API FastAPI" -ForegroundColor Gray
Write-Host "     • test-projects/html-static/  - HTML estático" -ForegroundColor Gray
Write-Host ""
Write-Host "  📝 Ejemplo de uso:" -ForegroundColor White
Write-Host '     curl -X POST http://localhost:3001/api/execute/run \' -ForegroundColor Gray
Write-Host '       -H "Content-Type: application/json" \' -ForegroundColor Gray
Write-Host '       -d "{\"projectPath\": \"./test-projects/react-demo\"}"' -ForegroundColor Gray
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "  ⏸️  Presiona Ctrl+C para detener todos los servicios" -ForegroundColor Yellow
Write-Host ""

# Mantener el script corriendo y mostrar logs
try {
    while ($true) {
        Start-Sleep -Seconds 1
        
        # Verificar que los jobs sigan corriendo
        if ($apiJob.State -ne "Running") {
            Write-Host "⚠️  API Server se detuvo" -ForegroundColor Yellow
            Receive-Job $apiJob
            break
        }
        
        if ($frontendJob -and $frontendJob.State -ne "Running") {
            Write-Host "⚠️  Frontend se detuvo" -ForegroundColor Yellow
            break
        }
    }
} finally {
    Write-Host ""
    Write-Host "🛑 Deteniendo servicios..." -ForegroundColor Yellow
    Stop-Job $apiJob -ErrorAction SilentlyContinue
    Remove-Job $apiJob -ErrorAction SilentlyContinue
    if ($frontendJob) {
        Stop-Job $frontendJob -ErrorAction SilentlyContinue
        Remove-Job $frontendJob -ErrorAction SilentlyContinue
    }
    Write-Host "✓ Servicios detenidos" -ForegroundColor Green
}
