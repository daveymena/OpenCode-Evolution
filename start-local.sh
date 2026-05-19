#!/bin/bash

echo "🚀 Iniciando OpenCode Evolved - Preview Test Local"
echo ""

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Verificar que el build existe
if [ ! -d "artifacts/opencode-evolved/dist" ]; then
    echo "❌ Build no encontrado. Ejecutando build..."
    PORT=8080 BASE_PATH="/" pnpm --filter @workspace/opencode-evolved run build
fi

echo -e "${GREEN}✓${NC} Build encontrado"
echo ""

# Iniciar el preview server en background
echo -e "${BLUE}→${NC} Iniciando Preview Server en puerto 8080..."
WORKSPACE="./test-projects" node preview-server.js &
PREVIEW_PID=$!
sleep 2

if kill -0 $PREVIEW_PID 2>/dev/null; then
    echo -e "${GREEN}✓${NC} Preview Server corriendo (PID: $PREVIEW_PID)"
else
    echo "❌ Preview Server falló al iniciar"
    exit 1
fi

# Servir el frontend
echo -e "${BLUE}→${NC} Sirviendo frontend en puerto 3000..."
cd artifacts/opencode-evolved/dist/public
python3 -m http.server 3000 &
FRONTEND_PID=$!
cd ../../../../
sleep 1

if kill -0 $FRONTEND_PID 2>/dev/null; then
    echo -e "${GREEN}✓${NC} Frontend corriendo (PID: $FRONTEND_PID)"
else
    echo "❌ Frontend falló al iniciar"
    kill $PREVIEW_PID 2>/dev/null
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✅ OpenCode Evolved está corriendo!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  🌐 Frontend:        http://localhost:3000"
echo "  🔍 Preview Server:  http://localhost:8080"
echo "  📁 Workspace:       ./test-projects"
echo ""
echo "  📝 Proyectos de prueba disponibles:"
echo "     • test-projects/react-demo/"
echo "     • test-projects/python-api/"
echo "     • test-projects/html-static/"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Presiona Ctrl+C para detener todos los servicios"
echo ""

# Función para limpiar al salir
cleanup() {
    echo ""
    echo "🛑 Deteniendo servicios..."
    kill $PREVIEW_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✓ Servicios detenidos"
    exit 0
}

trap cleanup SIGINT SIGTERM

# Mantener el script corriendo
wait
