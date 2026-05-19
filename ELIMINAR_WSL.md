# Eliminar Linux/WSL de Windows - Liberar Espacio

## 🎯 El Problema

WSL (Windows Subsystem for Linux) puede ocupar **5-20GB** de espacio en tu disco duro, especialmente si tienes múltiples distribuciones o has instalado muchos paquetes.

## 💾 Espacio que Liberarás

| Distribución | Tamaño típico |
|--------------|---------------|
| Ubuntu | 3-8 GB |
| Kali Linux | 5-12 GB |
| Debian | 2-5 GB |
| Arch Linux | 3-6 GB |
| **Total** | **5-20 GB** |

---

## 🚀 MÉTODO 1: Script Automático (Recomendado)

### Paso 1: Abrir PowerShell como Administrador

1. Presiona `Win + X`
2. Selecciona **"Terminal (Admin)"** o **"Windows PowerShell (Admin)"**

### Paso 2: Ejecutar el script

```powershell
# Ir al directorio del proyecto
cd C:\opencode-evolution\scripts

# Ejecutar script
.\remove-wsl.ps1
```

### Paso 3: Confirmar

Escribe `ELIMINAR` cuando te lo pida y presiona Enter.

### Paso 4: Reiniciar

El script te preguntará si quieres reiniciar. Selecciona **S**.

---

## 🛠️ MÉTODO 2: Manual (Paso a Paso)

### Paso 1: Ver qué tienes instalado

Abre PowerShell como Administrador y ejecuta:

```powershell
wsl --list --verbose
```

Verás algo como:
```
  NAME            STATE           VERSION
* Ubuntu          Stopped         2
  kali-linux      Stopped         2
```

### Paso 2: Eliminar cada distribución

Para cada distribución listada, ejecuta:

```powershell
# Eliminar Ubuntu
wsl --unregister Ubuntu

# Eliminar Kali Linux
wsl --unregister kali-linux

# Eliminar cualquier otra que tengas
wsl --unregister NOMBRE_DE_LA_DISTRO
```

**⚠️ Esto borra TODOS los datos de Linux permanentemente**

### Paso 3: Desinstalar WSL

```powershell
# Desinstalar WSL
dism.exe /online /disable-feature /featurename:Microsoft-Windows-Subsystem-Linux /norestart

# Desinstalar Virtual Machine Platform (necesario para WSL2)
dism.exe /online /disable-feature /featurename:VirtualMachinePlatform /norestart
```

### Paso 4: Eliminar archivos residuales

```powershell
# Eliminar aplicaciones de Linux desde Microsoft Store
Get-AppxPackage *Ubuntu* | Remove-AppxPackage
Get-AppxPackage *Kali* | Remove-AppxPackage
Get-AppxPackage *Debian* | Remove-AppxPackage
Get-AppxPackage *SUSE* | Remove-AppxPackage
```

### Paso 5: Limpiar archivos temporales

```powershell
# Limpiar caché
cleanmgr /c

# O usa la herramienta gráfica:
cleanmgr
```

Selecciona tu disco C: y marca todas las casillas.

### Paso 6: Reiniciar

```powershell
Restart-Computer
```

---

## 🔧 MÉTODO 3: Solo desde la Tienda Windows (Si no funciona lo anterior)

### Paso 1: Desinstalar desde Configuración

1. Abre **Configuración** (`Win + I`)
2. Ve a **Aplicaciones** → **Aplicaciones instaladas**
3. Busca "Ubuntu", "Kali", "Debian", etc.
4. Haz clic en cada una y selecciona **Desinstalar**

### Paso 2: Desinstalar componentes opcionales

1. En Configuración → **Aplicaciones** → **Características opcionales**
2. Busca "Windows Subsystem for Linux"
3. Selecciona y haz clic en **Desinstalar**

### Paso 3: Reiniciar

Reinicia tu PC para completar.

---

## 🧹 LIMPIEZA ADICIONAL

### Verificar espacio liberado

```powershell
# Después de reiniciar, ver espacio en disco
cd C:\
dir
# O usa Explorador de Archivos → Este equipo → Disco C:
```

### Eliminar archivos temporales manualmente

1. Presiona `Win + R`
2. Escribe `%temp%` y presiona Enter
3. Selecciona todo (`Ctrl + A`)
4. Elimina todo (ignora archivos en uso)

### Limpiar caché de WSL

```powershell
# Verificar si quedaron archivos grandes
Get-ChildItem -Path $env:LOCALAPPDATA -Recurse -ErrorAction SilentlyContinue | 
    Where-Object { $_.Name -like "*Ubuntu*" -or $_.Name -like "*WSL*" } | 
    Select-Object FullName, Length
```

---

## ✅ VERIFICACIÓN

### Comprobar que WSL se eliminó

```powershell
# Esto debería dar error "wsl no se reconoce"
wsl --list
```

Si aparece "'wsl' no se reconoce como un comando interno", ¡listo! WSL fue eliminado.

### Ver espacio recuperado

Abre **Explorador de Archivos** → **Este equipo** y revisa tu disco C:

Deberías ver varios GB más libres.

---

## 🔄 SI QUIERES VOLVER A INSTALAR WSL EN EL FUTURO

```powershell
# Instalar WSL con Ubuntu (un solo comando)
wsl --install

# O instalar desde Microsoft Store buscando "Ubuntu"
```

---

## 🆘 SOLUCIÓN DE PROBLEMAS

### "No se puede eliminar, está en uso"

```powershell
# Forzar cierre
taskkill /F /IM wsl.exe
taskkill /F /IM wslhost.exe

# Luego intenta eliminar de nuevo
wsl --unregister Ubuntu
```

### "Acceso denegado"

Asegúrate de:
1. Cerrar todas las ventanas de terminal Linux
2. Cerrar VS Code (si usas WSL con él)
3. Ejecutar PowerShell como **Administrador**

### "El subsistema de Linux no está instalado"

¡Eso es bueno! Significa que ya fue eliminado.

---

## 📊 ANTES Y DESPUÉS

| Aspecto | Antes (con WSL) | Después (sin WSL) |
|---------|-----------------|-------------------|
| Espacio usado | +5-20 GB | Liberado |
| Memoria RAM usada | +500MB-2GB | Liberado |
| Procesos en segundo plano | WSL, vmcompute | Menos procesos |
| Tiempo de inicio | Más lento | Más rápido |

---

**¿Necesitas ayuda con algún paso específico o el script no funciona?**
