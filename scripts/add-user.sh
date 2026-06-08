#!/bin/bash
# ============================================
# OpenCode Evolution - Agregar usuario SaaS
# ============================================
# Uso: ./add-user.sh <usuario> <puerto> <password>
# Ejemplo: ./add-user.sh juan 3004 clave123
# ============================================

if [ "$#" -ne 3 ]; then
    echo "Uso: $0 <usuario> <puerto> <password>"
    echo "Ejemplo: $0 juan 3004 mi_clave_segura"
    exit 1
fi

USER=$1
PORT=$2
PASSWORD=$3
CONFIG_FILE="scripts/users.conf"

# Validar puerto
if [ "$PORT" -lt 3001 ] || [ "$PORT" -gt 65535 ]; then
    echo "Error: El puerto debe estar entre 3001 y 65535"
    exit 1
fi

# Validar que el puerto no este en uso
if grep -q "|${PORT}|" "$CONFIG_FILE" 2>/dev/null; then
    echo "Error: El puerto $PORT ya esta asignado"
    exit 1
fi

# Agregar usuario
echo "${USER}|${PORT}|${PASSWORD}" >> "$CONFIG_FILE"
echo "Usuario '$USER' agregado en puerto $PORT"
echo ""
echo "Para aplicar los cambios:"
echo "  docker-compose restart"
echo ""
echo "El usuario accedera en:"
echo "  http://<tu-servidor>:$PORT"
echo "  Usuario: $USER"
echo "  Password: $PASSWORD"