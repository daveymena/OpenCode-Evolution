#!/bin/bash

# 🚀 Script de Instalación del Previsualizador Profesional
# Para OpenCode Evolved en Easypanel

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  🎨 OpenCode Evolved - Previsualizador Profesional"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funciones de utilidad
print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Verificar requisitos
echo "📋 Verificando requisitos..."

if ! command -v docker &> /dev/null; then
    print_error "Docker no está instalado"
    echo "   Instala Docker desde: https://docs.docker.com/get-docker/"
    exit 1
fi
print_success "Docker instalado"

if ! command -v node &> /dev/null; then
    print_warning "Node.js no está instalado (opcional para desarrollo local)"
else
    print_success "Node.js instalado: $(node --version)"
fi

if ! command -v pnpm &> /dev/null; then
    print_warning "pnpm no está instalado (opcional para desarrollo local)"
else
    print_success "pnpm instalado: $(pnpm --version)"
fi

echo ""

# Preguntar por configuración
echo "⚙️  Configuración"
echo ""

read -p "¿Deseas construir la imagen Docker? (s/n): " BUILD_IMAGE
read -p "¿Tienes una API key de Anthropic? (s/n): " HAS_ANTHROPIC
if [ "$HAS_ANTHROPIC" = "s" ]; then
    read -sp "Ingresa tu API key de Anthropic: " ANTHROPIC_KEY
    echo ""
fi

read -p "¿Tienes una API key de OpenAI? (s/n): " HAS_OPENAI
if [ "$HAS_OPENAI" = "s" ]; then
    read -sp "Ingresa tu API key de OpenAI: " OPENAI_KEY
    echo ""
fi

read -p "¿Deseas clonar un repositorio Git? (s/n): " HAS_GIT
if [ "$HAS_GIT" = "s" ]; then
    read -p "URL del repositorio: " GIT_URL
    read -p "Rama (default: main): " GIT_BRANCH
    GIT_BRANCH=${GIT_BRANCH:-main}
fi

echo ""

# Crear archivo .env
echo "📝 Creando archivo de configuración..."

cat > .env.local << EOF
# OpenCode Evolved - Configuración Local
# Generado: $(date)

# API Keys (al menos una requerida)
EOF

if [ "$HAS_ANTHROPIC" = "s" ]; then
    echo "ANTHROPIC_API_KEY=$ANTHROPIC_KEY" >> .env.local
fi

if [ "$HAS_OPENAI" = "s" ]; then
    echo "OPENAI_API_KEY=$OPENAI_KEY" >> .env.local
fi

if [ "$HAS_GIT" = "s" ]; then
    cat >> .env.local << EOF

# Git Configuration
GIT_REPO_URL=$GIT_URL
GIT_BRANCH=$GIT_BRANCH
GIT_USER_NAME=OpenCode Bot
GIT_USER_EMAIL=bot@opencode.local
EOF
fi

cat >> .env.local << EOF

# Resource Configuration
NODE_OPTIONS=--max-old-space-size=2048

# Ports
PORT=3000
PREVIEW_PORT=8080
DEV_PORT=5173
EOF

print_success "Archivo .env.local creado"

# Construir imagen si se solicitó
if [ "$BUILD_IMAGE" = "s" ]; then
    echo ""
    echo "🔨 Construyendo imagen Docker..."
    echo "   Esto puede tardar varios minutos..."
    
    if docker build -t opencode-evolved:latest .; then
        print_success "Imagen construida exitosamente"
    else
        print_error "Error al construir la imagen"
        exit 1
    fi
fi

# Crear docker-compose.yml
echo ""
echo "📦 Creando docker-compose.yml..."

cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  opencode:
    image: opencode-evolved:latest
    container_name: opencode-evolved
    ports:
      - "3000:3000"   # OpenCode UI
      - "8080:8080"   # Preview Server
      - "5173:5173"   # Vite Dev Server
      - "4200:4200"   # Angular
      - "8000:8000"   # Python/FastAPI
      - "5000:5000"   # Flask
    env_file:
      - .env.local
    volumes:
      - opencode-config:/root/.local/share/opencode
      - workspace:/root/workspace
      - projects:/root/projects
      - cache:/root/.cache/projects
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

volumes:
  opencode-config:
    driver: local
  workspace:
    driver: local
  projects:
    driver: local
  cache:
    driver: local
EOF

print_success "docker-compose.yml creado"

# Crear script de inicio rápido
echo ""
echo "🚀 Creando scripts de utilidad..."

cat > start.sh << 'EOF'
#!/bin/bash
echo "🚀 Iniciando OpenCode Evolved..."
docker-compose up -d
echo ""
echo "✓ OpenCode está corriendo!"
echo ""
echo "  📡 OpenCode UI:      http://localhost:3000"
echo "  🔍 Preview Server:   http://localhost:8080"
echo "  ⚡ Dev Server:       http://localhost:5173"
echo ""
echo "Para ver logs: docker-compose logs -f"
echo "Para detener: ./stop.sh"
EOF

cat > stop.sh << 'EOF'
#!/bin/bash
echo "🛑 Deteniendo OpenCode Evolved..."
docker-compose down
echo "✓ OpenCode detenido"
EOF

cat > logs.sh << 'EOF'
#!/bin/bash
docker-compose logs -f
EOF

cat > restart.sh << 'EOF'
#!/bin/bash
echo "🔄 Reiniciando OpenCode Evolved..."
docker-compose restart
echo "✓ OpenCode reiniciado"
EOF

chmod +x start.sh stop.sh logs.sh restart.sh

print_success "Scripts de utilidad creados"

# Resumen
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✅ Instalación Completada"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📁 Archivos creados:"
echo "   • .env.local          - Configuración de variables de entorno"
echo "   • docker-compose.yml  - Configuración de Docker Compose"
echo "   • start.sh            - Iniciar OpenCode"
echo "   • stop.sh             - Detener OpenCode"
echo "   • logs.sh             - Ver logs en tiempo real"
echo "   • restart.sh          - Reiniciar OpenCode"
echo ""
echo "🚀 Para iniciar OpenCode:"
echo "   ./start.sh"
echo ""
echo "📚 Documentación:"
echo "   • PREVISUALIZADOR-PROFESIONAL.md  - Guía completa del previsualizador"
echo "   • EASYPANEL-PREVIEW-SETUP.md      - Guía de despliegue en Easypanel"
echo ""
echo "🌐 URLs de acceso (después de iniciar):"
echo "   • OpenCode UI:      http://localhost:3000"
echo "   • Preview Server:   http://localhost:8080"
echo "   • Dev Server:       http://localhost:5173"
echo ""
echo "💡 Comandos útiles:"
echo "   docker-compose ps              - Ver estado de contenedores"
echo "   docker-compose logs -f         - Ver logs en tiempo real"
echo "   docker exec -it opencode bash  - Acceder al contenedor"
echo ""
echo "🎉 ¡Disfruta de OpenCode Evolved!"
echo ""
