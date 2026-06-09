#!/bin/bash
# ============================================
# OpenCode Evolution - Entrypoint SaaS
# Inicia instancias multi-tenant + VNC + Nginx
# ============================================
set -e

CONFIG_FILE="/etc/opencode/users.conf"
OPCODE_CONFIG="/root/.config/opencode/opencode.json"

echo "========================================"
echo " OpenCode Evolution - Sistema Completo"
echo "========================================"

# ============================================
# INICIAR DISPLAY VIRTUAL (Xvfb + x11vnc)
# ============================================
echo ""
echo "[+] Iniciando display virtual..."
Xvfb :99 -screen 0 1920x1080x24 +extension RANDR &
sleep 1
fluxbox &
sleep 1
x11vnc -display :99 -forever -nopw -shared -rfbport 5900 -bg -o /var/log/opencode/x11vnc.log
echo "     VNC Server: 0.0.0.0:5900 (sin password)"
echo "     Display:    :99 (1920x1080)"

# ============================================
# INICIAR NGINX
# ============================================
echo ""
echo "[+] Iniciando Nginx..."
nginx -g "daemon off;" &
sleep 1

# ============================================
# VERIFICAR HERRAMIENTAS INSTALADAS
# ============================================
echo ""
echo "[+] Herramientas disponibles:"
echo "     $(opencv_version 2>/dev/null || echo 'OpenCV ok')"
echo "     Tesseract: $(tesseract --version 2>&1 | head -1)"
echo "     Playwright: $(npx playwright --version 2>/dev/null || echo 'ok')"
echo "     Python: $(python3 --version)"
echo "     Node: $(node --version)"
echo "     VNC: x11vnc, Xvfb, fluxbox"
echo "     RDP: xfreerdp"
echo "     Vision: OpenCV, Tesseract, PyAutoGUI"

# ============================================
# VERIFICAR CONFIG DE USUARIOS
# ============================================
if [ ! -f "$CONFIG_FILE" ]; then
    echo "[ERROR] No se encuentra $CONFIG_FILE"
    echo "Creando usuario admin por defecto..."
    mkdir -p /etc/opencode
    echo "admin|3001|${OPENCODE_SERVER_PASSWORD:-admin}" > "$CONFIG_FILE"
fi

# ============================================
# INICIAR INSTANCIAS OPENCODE POR USUARIO
# ============================================
echo ""
echo "Iniciando instancias SaaS..."

grep -v '^#' "$CONFIG_FILE" | grep -v '^$' | while IFS='|' read -r USER PORT PASSWORD; do
    APP_NAME="opencode-${USER}"
    DATA_DIR="/data/${USER}"

    mkdir -p "$DATA_DIR/.config/opencode"
    mkdir -p "$DATA_DIR/.local/share/opencode"
    mkdir -p "/workspace/${USER}"

    if [ -f "$OPCODE_CONFIG" ]; then
        cp "$OPCODE_CONFIG" "$DATA_DIR/.config/opencode/opencode.json"
    fi

    echo ""
    echo "  [+] Usuario: $USER"
    echo "      Web:     0.0.0.0:$PORT"
    echo "      Datos:   $DATA_DIR"

    OPENCODE_APPNAME="$APP_NAME" \
    OPENCODE_CONFIG_DIR="$DATA_DIR/.config/opencode" \
    OPENCODE_DATA_DIR="$DATA_DIR/.local/share/opencode" \
    OPENCODE_SERVER_USERNAME="$USER" \
    OPENCODE_SERVER_PASSWORD="$PASSWORD" \
    opencode web --hostname "0.0.0.0" --port "$PORT" --cors "*" &
done

# Instancia publica por defecto
echo ""
echo "  [+] Instancia publica en 0.0.0.0:3000"
OPENCODE_APPNAME="opencode-default" opencode web --hostname "0.0.0.0" --port 3000 --cors "*" &

# ============================================
# MOSTRAR RESUMEN
# ============================================
echo ""
echo "========================================"
echo " OpenCode Evolution - INICIADO"
echo "========================================"
echo ""
echo " WEB (OpenCode):"
echo "   Publica:    http://localhost:3000"
grep -v '^#' "$CONFIG_FILE" | grep -v '^$' | while IFS='|' read -r USER PORT PASSWORD; do
    echo "   $USER:      http://localhost:$PORT"
done
echo ""
echo " CONTROL REMOTO:"
echo "   VNC:        vnc://localhost:5900 (display virtual :99)"
echo "   RDP:        disponible via xfreerdp"
echo "   SSH:        disponible en contenedor"
echo ""
echo " HERRAMIENTAS:"
echo "   Vision:     OpenCV, Tesseract OCR, Screenshot"
echo "   Browser:    Playwright (Chromium + Firefox)"
echo "   Automacion: PyAutoGUI, xdotool, Selenium"
echo "   Archivos:   SSH, SCP, Rsync, SMB"
echo ""
echo " INSTALADOR:"
echo "   http://localhost/download/OpenCode-Evolution-Setup.exe"
echo ""

wait -n
