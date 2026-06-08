#!/bin/bash
# ============================================
# OpenCode Evolution - Listar usuarios SaaS
# ============================================

CONFIG_FILE="scripts/users.conf"

if [ ! -f "$CONFIG_FILE" ]; then
    echo "No hay usuarios configurados"
    exit 1
fi

echo "========================================"
echo " Usuarios SaaS - OpenCode Evolution"
echo "========================================"
printf " %-15s %-8s %-18s\n" "USUARIO" "PUERTO" "PASSWORD"
printf " %-15s %-8s %-18s\n" "-------" "------" "--------"

grep -v '^#' "$CONFIG_FILE" | grep -v '^$' | while IFS='|' read -r USER PORT PASSWORD; do
    printf " %-15s %-8s %-18s\n" "$USER" "$PORT" "$PASSWORD"
done
echo "========================================"