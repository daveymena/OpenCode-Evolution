#!/bin/bash
# ============================================
# OpenCode Evolution - Entrypoint SaaS
# Inicia instancias multi-tenant de OpenCode
# ============================================
set -e

CONFIG_FILE="/etc/opencode/users.conf"
OPCODE_CONFIG="/root/.config/opencode/opencode.json"

echo "========================================"
echo " OpenCode Evolution - SaaS Entrypoint"
echo "========================================"

# Verificar configuracion
if [ ! -f "$CONFIG_FILE" ]; then
    echo "[ERROR] No se encuentra $CONFIG_FILE"
    echo "Creando usuario admin por defecto..."
    mkdir -p /etc/opencode
    echo "admin|3001|${OPENCODE_SERVER_PASSWORD:-admin}" > "$CONFIG_FILE"
fi

echo ""
echo "Iniciando instancias OpenCode..."

# Leer usuarios del archivo de configuracion
grep -v '^#' "$CONFIG_FILE" | grep -v '^$' | while IFS='|' read -r USER PORT PASSWORD; do
    APP_NAME="opencode-${USER}"
    DATA_DIR="/data/${USER}"

    mkdir -p "$DATA_DIR/.config/opencode"
    mkdir -p "$DATA_DIR/.local/share/opencode"
    mkdir -p "/workspace/${USER}"

    # Copiar configuracion base
    if [ -f "$OPCODE_CONFIG" ]; then
        cp "$OPCODE_CONFIG" "$DATA_DIR/.config/opencode/opencode.json"
    fi

    echo ""
    echo "  [+] Usuario: $USER"
    echo "      Puerto:  $PORT"
    echo "      Datos:   $DATA_DIR"
    echo "      AppName: $APP_NAME"

    # Iniciar instancia OpenCode con datos aislados
    OPENCODE_APPNAME="$APP_NAME" \
    OPENCODE_CONFIG_DIR="$DATA_DIR/.config/opencode" \
    OPENCODE_DATA_DIR="$DATA_DIR/.local/share/opencode" \
    OPENCODE_SERVER_USERNAME="$USER" \
    OPENCODE_SERVER_PASSWORD="$PASSWORD" \
    opencode web \
        --hostname "0.0.0.0" \
        --port "$PORT" \
        &
done

# Iniciar instancia por defecto (puerto 3000)
echo ""
echo "  [+] Instancia publica (default)"
echo "      Puerto:  3000"
echo ""

OPENCODE_APPNAME="opencode-default" \
opencode web \
    --hostname "0.0.0.0" \
    --port 3000 \
    &

echo ""
echo "========================================"
echo " OpenCode Evolution SaaS iniciado"
echo "========================================"
echo ""
echo " Usuarios activos:"
grep -v '^#' "$CONFIG_FILE" | grep -v '^$' | while IFS='|' read -r USER PORT PASSWORD; do
    echo "   - $USER  →  http://localhost:$PORT"
done
echo "   - default →  http://localhost:3000"
echo ""

# Mantener el contenedor vivo
wait -n