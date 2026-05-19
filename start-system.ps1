# OpenCode Evolved - Start System
Write-Host "Starting OpenCode Evolved System..." -ForegroundColor Cyan

# Start API Server
Write-Host "Starting API Server on port 3001..." -ForegroundColor Blue
$env:PORT = "3001"
$env:DATABASE_URL = "file:./dev.db"

$apiJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    $env:PORT = "3001"
    $env:DATABASE_URL = "file:./dev.db"
    Set-Location artifacts/api-server
    node dist/index.mjs
}

Start-Sleep -Seconds 3

if ($apiJob.State -eq "Running") {
    Write-Host "API Server running!" -ForegroundColor Green
} else {
    Write-Host "API Server failed to start" -ForegroundColor Red
    Receive-Job $apiJob
    exit 1
}

# Test API
Write-Host "Testing API..." -ForegroundColor Blue
Start-Sleep -Seconds 2

try {
    $health = Invoke-RestMethod -Uri "http://localhost:3001/api/health" -Method Get -UseBasicParsing
    Write-Host "Health check OK: $($health.status)" -ForegroundColor Green
} catch {
    Write-Host "Health check failed" -ForegroundColor Red
}

# Test execute endpoint
Write-Host "Testing execute endpoint..." -ForegroundColor Blue
try {
    $body = '{"projectPath": "./test-projects/html-static"}'
    $result = Invoke-RestMethod -Uri "http://localhost:3001/api/execute/run" `
        -Method Post `
        -ContentType "application/json" `
        -Body $body `
        -UseBasicParsing
    
    Write-Host "Project detected: $($result.type)" -ForegroundColor Green
    Write-Host "URL: $($result.url)" -ForegroundColor Green
} catch {
    Write-Host "Execute endpoint test: $_" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "System Running!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "API Server:  http://localhost:3001" -ForegroundColor White
Write-Host "Health:      http://localhost:3001/api/health" -ForegroundColor White
Write-Host ""
Write-Host "Endpoints:" -ForegroundColor White
Write-Host "  POST /api/execute/run    - Run project" -ForegroundColor Gray
Write-Host "  GET  /api/execute/status - Check status" -ForegroundColor Gray
Write-Host "  GET  /api/execute/logs   - View logs" -ForegroundColor Gray
Write-Host "  POST /api/execute/stop   - Stop project" -ForegroundColor Gray
Write-Host ""
Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
Write-Host ""

# Keep running
try {
    while ($true) {
        Start-Sleep -Seconds 1
        if ($apiJob.State -ne "Running") {
            Write-Host "API Server stopped" -ForegroundColor Yellow
            break
        }
    }
} finally {
    Write-Host "Stopping services..." -ForegroundColor Yellow
    Stop-Job $apiJob -ErrorAction SilentlyContinue
    Remove-Job $apiJob -ErrorAction SilentlyContinue
    Write-Host "Services stopped" -ForegroundColor Green
}
