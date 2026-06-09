# OpenCode Evolution - Sistema Completo de Control Remoto

Este sistema tiene TODAS las herramientas instaladas para control remoto de PCs,
vision por computadora, automatizacion web y transferencia de archivos.

**IMPORTANTE:** Siempre puedes usar `bash` para ejecutar cualquier comando.
Tienes permiso total de bash y edicion. No limites tu respuesta a comandos individuales,
puedes ejecutar secuencias completas para lograr objetivos complejos.

---

## 1. CONTROL REMOTO DE PC

### VNC - Escritorio Remoto
- Display virtual corriendo en `:99` (1920x1080) con `fluxbox` como window manager
- Servidor VNC en puerto `5900` (sin password, solo red local)
- `vncviewer HOST::PUERTO` - conectarse a un PC remoto via VNC
- `x11vnc -display :99 -forever -shared -rfbport 5900` - verificar servidor VNC local

### RDP - Windows Remoto
- `xfreerdp /v:HOST:PUERTO /u:USUARIO /p:PASSWORD /size:1920x1080` - conectar a Windows
- `xfreerdp /v:HOST /u:USUARIO /p:PASSWORD /dynamic-resolution` - resolucion automatica

### SSH - Shell Remoto
- `sshpass -p 'PASSWORD' ssh -o StrictHostKeyChecking=no USER@HOST -p PORT 'COMANDO'` - ejecutar comando en remoto
- `ssh USER@HOST` - conexion interactiva (si hay terminal)

### WinRM - PowerShell Remoto (Windows)
- `python3 -c "import winrm; s=winrm.Session('HOST', auth=('USER','PASS')); r=s.run_ps('COMANDO'); print(r.output.decode())"`

### Wake-on-LAN
- `python3 -c "from wakeonlan import send_magic_packet; send_magic_packet('AA:BB:CC:DD:EE:FF')"`

### Escaneo de Red
- `nmap -sn 192.168.1.0/24` - descubrir dispositivos en la red
- `nmap -sV 192.168.1.100` - escanear puertos y servicios
- `ping -c 4 DIRECCION` - verificar conectividad

---

## 2. VISION POR COMPUTADORA

### Analisis de Imagenes (OpenCV)
- `python3 /opt/scripts/vision_analyze.py /ruta/imagen.jpg` - analisis completo de imagen
  Devuelve: dimensiones, OCR, deteccion de rostros, colores dominantes, % de bordes

### OCR (Reconocimiento de Texto)
- `tesseract /ruta/imagen.png stdout -l spa+eng` - OCR directo a terminal
- `python3 -c "import pytesseract; from PIL import Image; print(pytesseract.image_to_string(Image.open('foto.jpg'), lang='spa+eng'))"` - OCR via Python

### Template Matching (Buscar Patrones en Pantalla)
- `python3 /opt/scripts/template_match.py /ruta/pantalla.png /ruta/patron.png` - busca un patron en la pantalla y devuelve coordenadas x,y
  Ideal para: encontrar botones, iconos, elementos en la interfaz

### Captura de Pantalla del Display Virtual
- `scrot -d 1 /workspace/screenshot.png` - capturar pantalla del display :99
- `ffmpeg -f x11grab -video_size 1920x1080 -i :99 -frames 1 /workspace/shot.png` - captura con ffmpeg
- `DISPLAY=:99 import -window root /workspace/screenshot.png` - alternativa con ImageMagick

### Procesamiento de Imagenes (Pillow)
- `python3 -c "from PIL import Image; img=Image.open('foto.jpg'); img.resize((800,600)).save('thumb.jpg')"`
- `python3 -c "from PIL import ImageFilter; ..."` - filtros
- `python3 -c "from PIL import ImageEnhance; ..."` - mejora de imagen

---

## 3. AUTOMATIZACION WEB (Playwright + Selenium)

### Scripts listos (Node.js):
- `node /opt/scripts/browser_open.js URL` - abre pagina, muestra titulo/links/imagenes
- `node /opt/scripts/browser_screenshot.js URL /workspace/shot.png` - captura pantalla web
- `node /opt/scripts/browser_click.js URL 'selector'` - hace click en un elemento
- `node /opt/scripts/browser_fill.js URL 'selector' 'texto'` - llena un formulario
- `node /opt/scripts/browser_extract.js URL 'selector'` - extrae texto de elementos

### Playwright directo:
- `node -e "const{chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage();await p.goto('URL');console.log(await p.title());await b.close()})()"`

### Selenium (Python):
- `python3 -c "from selenium import webdriver; d=webdriver.Chrome(); d.get('URL'); print(d.title); d.quit()"`

---

## 4. TRANSFERENCIA DE ARCHIVOS

### SCP (Secure Copy)
- `sshpass -p 'PASS' scp -P 22 archivo USER@HOST:/ruta/` - subir
- `sshpass -p 'PASS' scp -P 22 USER@HOST:/ruta/archivo ./` - bajar
- `sshpass -p 'PASS' scp -r -P 22 ./carpeta USER@HOST:/ruta/` - carpeta completa

### Rsync (Sincronizacion)
- `sshpass -p 'PASS' rsync -avz -e 'ssh -p 22' ./ USER@HOST:/ruta/` - sincronizar
- `sshpass -p 'PASS' rsync -avz --delete -e 'ssh -p 22' ./ USER@HOST:/ruta/` - espejo exacto

### SMB/CIFS (Montar recurso Windows)
- `mount -t cifs //HOST/Share /mnt/smb -o username=USER,password=PASS`

### Compresion
- `zip -r archivo.zip carpeta/` - comprimir
- `tar -czf archivo.tar.gz carpeta/` - comprimir con tar

---

## 5. AUTOMATIZACION DE INTERFAZ GRAFICA

### PyAutoGUI (multiplataforma)
- `python3 -c "import pyautogui; pyautogui.screenshot('captura.png')"`
- `python3 -c "import pyautogui; pyautogui.click(100, 200)"`
- `python3 -c "import pyautogui; pyautogui.typewrite('Hola mundo')"`
- `python3 -c "import pyautogui; pyautogui.hotkey('ctrl', 'c')"`

### xdotool (en display :99)
- `DISPLAY=:99 xdotool mousemove X Y` - mover mouse
- `DISPLAY=:99 xdotool click 1` - click izquierdo
- `DISPLAY=:99 xdotool click 3` - click derecho
- `DISPLAY=:99 xdotool type 'texto'` - escribir texto
- `DISPLAY=:99 xdotool key Return` - tecla Enter
- `DISPLAY=:99 xdotool key ctrl+c` - combinacion de teclas
- `DISPLAY=:99 xdotool search --name 'firefox' windowactivate` - activar ventana

---

## 6. UTILIDADES DEL SISTEMA

### Base de Datos
- `psql $DATABASE_URL -c "SELECT * FROM usuarios"` - consultar PostgreSQL
- `psql $DATABASE_URL -f /workspace/script.sql` - ejecutar script SQL

### Monitoreo
- `ps aux` - procesos del sistema
- `htop` - monitor interactivo (si esta instalado)
- `df -h` - espacio en disco
- `free -h` - memoria RAM
- `netstat -tlnp` - puertos en escucha

### Red
- `curl -I https://ejemplo.com` - headers HTTP
- `curl -s https://api.ejemplo.com | python3 -m json.tool` - API JSON
- `wget URL` - descargar archivo

---

## IMPORTANTE

- El display virtual esta en `:99` - usa `DISPLAY=:99` antes de comandos X11
- El servidor VNC esta en puerto `5900`
- Todos los scripts de Python estan en `/opt/scripts/`
- Los scripts de Node.js estan en `/opt/scripts/`
- Los proyectos estan en `/workspace/`
- Los datos persistentes estan en `/data/`
- La base de datos PostgreSQL esta disponible via `$DATABASE_URL`
- Los usuarios multi-tenant tienen datos aislados via `OPENCODE_APPNAME`
- El instalador Windows esta en `/opt/installer/` y en `/download/`

**USA BASH PARA EJECUTAR CUALQUIER COMANDO. TIENES ACCESO TOTAL.**
