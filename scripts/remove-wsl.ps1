# ============================================================
# Remove WSL Completely - Liberar espacio de Linux en Windows
# Ejecutar como Administrador en PowerShell
# ============================================================

Write-Host "
╔═══════════════════════════════════════════════════════════╗
║  ELIMINAR WSL / LINUX DE WINDOWS                          ║
║  Esto liberará TODO el espacio ocupado por Linux           ║
╚═══════════════════════════════════════════════════════════╝
" -ForegroundColor Cyan

# Verificar si se ejecuta como administrador
$currentPrincipal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
if (-not $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Host "❌ ERROR: Debes ejecutar este script como Administrador" -ForegroundColor Red
    Write-Host "   Click derecho en PowerShell → 'Ejecutar como administrador'"
    exit 1
}

Write-Host "🔍 Paso 1: Detectando instalaciones de WSL..." -ForegroundColor Yellow

# Listar distribuciones instaladas
$distros = wsl --list --quiet 2>$null

if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($distros)) {
    Write-Host "   ℹ️  No se encontraron distribuciones WSL instaladas" -ForegroundColor Green
} else {
    Write-Host "   Distribuciones encontradas:" -ForegroundColor Cyan
    $distros -split "`r`n" | ForEach-Object {
        if (-not [string]::IsNullOrWhiteSpace($_)) {
            Write-Host "      • $_" -ForegroundColor White
        }
    }

    Write-Host "
⚠️  ADVERTENCIA: Esto eliminará COMPLETAMENTE todas las distribuciones Linux" -ForegroundColor Red
    Write-Host "   y TODOS los datos dentro de ellas." -ForegroundColor Red
    Write-Host "   Esta acción NO se puede deshacer." -ForegroundColor Red
    Write-Host ""

    $confirm = Read-Host "¿Estás seguro de que quieres continuar? (escribe 'ELIMINAR' para confirmar)"

    if ($confirm -eq "ELIMINAR") {
        Write-Host "
🗑️  Paso 2: Eliminando distribuciones Linux..." -ForegroundColor Yellow

        # Desregistrar (eliminar) cada distribución
        $distros -split "`r`n" | ForEach-Object {
            $distro = $_.Trim()
            if (-not [string]::IsNullOrWhiteSpace($distro)) {
                Write-Host "   Eliminando $distro..." -NoNewline
                wsl --unregister $distro 2>$null
                if ($LASTEXITCODE -eq 0) {
                    Write-Host " ✅" -ForegroundColor Green
                } else {
                    Write-Host " ⚠️  (puede que ya esté eliminada)" -ForegroundColor Yellow
                }
            }
        }
    } else {
        Write-Host "
❌ Cancelado por el usuario" -ForegroundColor Yellow
        exit 0
    }
}

Write-Host "
🔧 Paso 3: Desinstalando componentes de WSL..." -ForegroundColor Yellow

# Desinstalar WSL
Write-Host "   Desinstalando WSL..." -NoNewline
dism.exe /online /disable-feature /featurename:Microsoft-Windows-Subsystem-Linux /norestart 2>$null
Write-Host " ✅" -ForegroundColor Green

# Desinstalar Virtual Machine Platform (requerido por WSL2)
Write-Host "   Desinstalando Virtual Machine Platform..." -NoNewline
dism.exe /online /disable-feature /featurename:VirtualMachinePlatform /norestart 2>$null
Write-Host " ✅" -ForegroundColor Green

Write-Host "
🧹 Paso 4: Limpiando archivos residuales..." -ForegroundColor Yellow

# Directorios comunes de WSL
$wslPaths = @(
    "$env:LOCALAPPDATA\Packages\*Ubuntu*",
    "$env:LOCALAPPDATA\Packages\*Kali*",
    "$env:LOCALAPPDATA\Packages\*Debian*",
    "$env:LOCALAPPDATA\Packages\*SUSE*",
    "$env:LOCALAPPDATA\Packages\*Linux*",
    "$env:USERPROFILE\AppData\Local\Microsoft\WindowsApps\ubuntu*",
    "$env:USERPROFILE\AppData\Local\Microsoft\WindowsApps\kali*",
    "$env:USERPROFILE\AppData\Local\Microsoft\WindowsApps\debian*",
    "C:\Windows\System32\wsl.exe",
    "C:\Windows\System32\wslapi.dll",
    "C:\Windows\System32\wslhost.exe"
)

foreach ($path in $wslPaths) {
    if (Test-Path $path) {
        Write-Host "   Eliminando $path..." -ForegroundColor DarkGray
        Remove-Item -Path $path -Recurse -Force -ErrorAction SilentlyContinue
    }
}

# Limpiar caché de Windows Update (puede contener archivos de WSL)
Write-Host "   Limpiando caché de actualizaciones..." -NoNewline
Stop-Service wuauserv -Force -ErrorAction SilentlyContinue
Remove-Item -Path "C:\Windows\SoftwareDistribution\Download\*" -Recurse -Force -ErrorAction SilentlyContinue
Start-Service wuauserv -ErrorAction SilentlyContinue
Write-Host " ✅" -ForegroundColor Green

Write-Host "
📊 Paso 5: Calculando espacio liberado..." -ForegroundColor Yellow

# Calcular espacio en disco
$disks = Get-WmiObject -Class Win32_LogicalDisk | Where-Object { $_.FreeSpace -ne $null }
$systemDrive = $disks | Where-Object { $_.DeviceID -eq "C:" }

if ($systemDrive) {
    $freeGB = [math]::Round($systemDrive.FreeSpace / 1GB, 2)
    $totalGB = [math]::Round($systemDrive.Size / 1GB, 2)
    $usedGB = $totalGB - $freeGB

    Write-Host "   Disco C:" -ForegroundColor Cyan
    Write-Host "      Total: $totalGB GB" -ForegroundColor White
    Write-Host "      Usado: $usedGB GB" -ForegroundColor White
    Write-Host "      Libre: $freeGB GB" -ForegroundColor Green
}

Write-Host "
✅ WSL HA SIDO COMPLETAMENTE ELIMINADO" -ForegroundColor Green
Write-Host "
💡 Notas:" -ForegroundColor Cyan
Write-Host "   • Reinicia tu PC para completar la desinstalación"
Write-Host "   • El espacio liberado puede variar (típicamente 5-20GB)"
Write-Host "   • Si quieres volver a instalar WSL en el futuro:" -ForegroundColor Yellow
Write-Host "     wsl --install"
Write-Host ""

# Preguntar si quiere reiniciar
$restart = Read-Host "¿Quieres reiniciar ahora? (S/N)"
if ($restart -eq "S" -or $restart -eq "s") {
    Write-Host "
🔄 Reiniciando en 5 segundos..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5
    Restart-Computer -Force
} else {
    Write-Host "
👍 Listo. Recuerda reiniciar manualmente más tarde." -ForegroundColor Green
}

Write-Host ""
