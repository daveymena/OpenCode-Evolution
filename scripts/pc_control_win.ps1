# ============================================
# OpenCode Evolution - PC Control (Windows)
# Herramientas locales para controlar el PC
# ============================================

param(
    [string]$Action = "help",
    [string]$Target = "",
    [string]$User = "",
    [string]$Password = "",
    [string]$Command = "",
    [string]$Port = "3389"
)

function Show-Menu {
    Write-Host @"
============================================
 OpenCode Evolution - PC Control Windows
============================================
 Acciones disponibles:

 1. info           - Informacion del sistema
 2. processes      - Listar procesos
 3. services       - Listar servicios
 4. users          - Usuarios conectados
 5. network        - Informacion de red
 6. screenshots    - Tomar captura de pantalla
 7. remote-rdp     - Conectar via RDP a otro PC
 8. remote-ssh     - Conectar via SSH a otro PC
 9. remote-winrm   - Ejecutar comando remoto WinRM
10. wake-pc        - Encender PC via WOL
11. share-folder   - Compartir carpeta en red
12. key-logger     - Monitoreo de teclado (local)
============================================
"@
}

function Get-SystemInfo {
    Write-Host "=== INFORMACION DEL SISTEMA ===" -ForegroundColor Cyan
    Get-ComputerInfo | Select-Object WindowsVersion, WindowsBuildLabEx,
        WindowsInstallationType, OsName, OsVersion, OsArchitecture,
        BiosManufacturer, BiosSMBiosVersion, CsProcessors, CsTotalPhysicalMemory
}

function Get-ProcessList {
    Write-Host "=== PROCESOS ACTIVOS ===" -ForegroundColor Cyan
    Get-Process | Sort-Object CPU -Descending | Select-Object -First 30
}

function Get-ServiceList {
    Write-Host "=== SERVICIOS ===" -ForegroundColor Cyan
    Get-Service | Where-Object Status -eq 'Running' | Format-Table Name, DisplayName, Status
}

function Get-UserSessions {
    Write-Host "=== USUARIOS CONECTADOS ===" -ForegroundColor Cyan
    query user
}

function Get-NetworkInfo {
    Write-Host "=== INFORMACION DE RED ===" -ForegroundColor Cyan
    Get-NetIPAddress | Where-Object AddressFamily -eq 'IPv4' | Format-Table
    Write-Host "Puertos en escucha:" -ForegroundColor Yellow
    netstat -ano | Select-String "LISTEN"
}

function Take-Screenshot {
    param([string]$Path = "$env:USERPROFILE\Desktop\capture.png")
    Write-Host "Tomando captura de pantalla..." -ForegroundColor Yellow
    Add-Type -AssemblyName System.Windows.Forms
    Add-Type -AssemblyName System.Drawing
    $bounds = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds
    $bitmap = New-Object System.Drawing.Bitmap $bounds.Width, $bounds.Height
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.CopyFromScreen($bounds.Location, [System.Drawing.Point]::Empty, $bounds.Size)
    $bitmap.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
    $graphics.Dispose()
    $bitmap.Dispose()
    Write-Host "Captura guardada en: $Path" -ForegroundColor Green
}

function Connect-RDP {
    param([string]$Hostname, [string]$Port = "3389")
    Write-Host "Conectando via RDP a $Hostname`:$Port..." -ForegroundColor Yellow
    Start-Process "mstsc" -ArgumentList "/v:$Hostname`:$Port"
}

function Invoke-SSHCommand {
    param([string]$Hostname, [string]$User, [string]$Pass, [string]$Cmd)
    Write-Host "Ejecutando comando SSH en $User@$Hostname..." -ForegroundColor Yellow
    # Requiere tener ssh.exe (OpenSSH Client instalado)
    ssh "$User@$Hostname" $Cmd
}

function Invoke-WinRMCommand {
    param([string]$Hostname, [string]$User, [string]$Pass, [string]$Cmd)
    Write-Host "Ejecutando WinRM en $Hostname..." -ForegroundColor Yellow
    $secpass = ConvertTo-SecureString $Pass -AsPlainText -Force
    $cred = New-Object System.Management.Automation.PSCredential($User, $secpass)
    try {
        Invoke-Command -ComputerName $Hostname -Credential $cred -ScriptBlock ([scriptblock]::Create($Cmd))
    } catch {
        Write-Host "Error WinRM: $_" -ForegroundColor Red
        Write-Host "Prueba habilitar WinRM en el target: Enable-PSRemoting -Force" -ForegroundColor Yellow
    }
}

function Send-WOL {
    param([string]$MacAddress)
    Write-Host "Enviando Magic Packet a $MacAddress..." -ForegroundColor Yellow
    $mac = $MacAddress -replace '[:-]', ''
    $target = [Net.IPAddress]::Broadcast
    $packet = [byte[]]@(0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF)
    for ($i = 0; $i -lt 16; $i++) {
        for ($j = 0; $j -lt 6; $j++) {
            $packet += [Convert]::ToByte($mac.Substring($j * 2, 2), 16)
        }
    }
    $udp = New-Object System.Net.Sockets.UdpClient
    $udp.Connect($target, 9)
    $udp.Send($packet, $packet.Length) | Out-Null
    $udp.Close()
    Write-Host "Magic Packet enviado!" -ForegroundColor Green
}

# === MAIN ===
switch ($Action.ToLower()) {
    "info"        { Get-SystemInfo }
    "processes"   { Get-ProcessList }
    "services"    { Get-ServiceList }
    "users"       { Get-UserSessions }
    "network"     { Get-NetworkInfo }
    "screenshots" { Take-Screenshot }
    "remote-rdp"  { Connect-RDP -Hostname $Target -Port $Port }
    "remote-ssh"  { Invoke-SSHCommand -Hostname $Target -User $User -Pass $Password -Cmd $Command }
    "remote-winrm" { Invoke-WinRMCommand -Hostname $Target -User $User -Pass $Password -Cmd $Command }
    "wake-pc"     { Send-WOL -MacAddress $Target }
    "share-folder" {
        net share "$(Split-Path $Target -Leaf)"="$Target" /GRANT:"Todos,FULL"
        Write-Host "Carpeta compartida: $Target" -ForegroundColor Green
    }
    "key-logger" {
        Write-Host "Monitoreo de teclado iniciado (ESC para salir)..." -ForegroundColor Yellow
        Add-Type -AssemblyName System.Windows.Forms
        while ($true) {
            if ([System.Windows.Forms.Control]::ModifierKeys -eq [System.Windows.Forms.Keys]::Escape) { break }
            Start-Sleep -Milliseconds 100
        }
    }
    default {
        Show-Menu
        Write-Host @"

 USO:
   .\pc_control_win.ps1 -Action <accion> [parametros]

 EJEMPLOS:
   .\pc_control_win.ps1 -Action info
   .\pc_control_win.ps1 -Action screenshots
   .\pc_control_win.ps1 -Action remote-rdp -Target 192.168.1.100
   .\pc_control_win.ps1 -Action remote-winrm -Target 192.168.1.100 -User admin -Password pass -Command "Get-Process"
   .\pc_control_win.ps1 -Action wake-pc -Target AA:BB:CC:DD:EE:FF
"@ -ForegroundColor Cyan
    }
}
