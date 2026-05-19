# 🎨 Previsualizador Profesional - OpenCode Evolved

## 📦 ¿Qué se ha creado?

Un **sistema completo de previsualización profesional** para OpenCode que permite ejecutar y visualizar aplicaciones de **cualquier lenguaje y framework** directamente en la nube, sin las limitaciones de una terminal tradicional.

## 🎯 Problema Resuelto

**ANTES**: OpenCode decía "por ser una terminal no puede ejecutar el proyecto en su entorno"

**AHORA**: OpenCode puede:
- ✅ Detectar automáticamente el tipo de proyecto
- ✅ Instalar dependencias automáticamente
- ✅ Ejecutar servidores de desarrollo
- ✅ Mostrar la aplicación en un preview profesional
- ✅ Soportar múltiples lenguajes simultáneamente
- ✅ Funcionar perfectamente en la nube (Easypanel)

## 🏗️ Componentes Creados

### 1. **Preview Component Mejorado** (`artifacts/opencode-evolved/src/components/ide/Preview.tsx`)
- 🖥️ Vistas responsive (Desktop, Tablet, Mobile)
- 🔄 Rotación de dispositivos
- 📊 Consola integrada para logs
- 🌐 Navegador web completo
- 🎨 Renderizado de múltiples tipos de archivos (HTML, JS, CSS, MD)
- 📡 Comunicación con el preview server

### 2. **Preview Server** (`preview-server.js`)
- 🔍 Auto-detección de tipo de proyecto
- 📦 Instalación automática de dependencias
- 🚀 Gestión de procesos de desarrollo
- 📡 API REST para control
- 📝 Logs en tiempo real
- 🔄 Soporte para múltiples proyectos simultáneos

**Frameworks soportados**:
- React, Vue, Angular, Svelte, Next.js, Nuxt, Gatsby
- Node.js, Express, Fastify, Koa
- Python (FastAPI, Django, Flask)
- Go, Rust, PHP, Ruby
- HTML/CSS/JS estáticos

### 3. **Dockerfile Mejorado** (`dockerfile`)
- 🐍 Python + pip + uvicorn
- 🐹 Go
- 💎 Ruby + Rails
- 🐘 PHP
- 🦀 Rust (preparado)
- 📦 Múltiples herramientas de desarrollo
- 🔧 PM2 y nodemon para gestión de procesos

### 4. **Entrypoint Mejorado** (`entrypoint.sh`)
- 🚀 Inicio automático del preview server
- 🔄 Watcher inteligente para cambios en package.json
- 💾 Cache externo de node_modules
- 📊 Logs organizados
- ⚡ Auto-inicio de dev servers
- 🎯 Detección de cambios y reinstalación

### 5. **Documentación Completa**

#### `PREVISUALIZADOR-PROFESIONAL.md`
- Guía completa de uso
- Arquitectura del sistema
- API del preview server
- Solución de problemas
- Ejemplos de uso

#### `EASYPANEL-PREVIEW-SETUP.md`
- Configuración paso a paso para Easypanel
- Variables de entorno
- Volúmenes persistentes
- Recursos recomendados
- Health checks
- Monitoreo y logs
- Backup y restauración
- Troubleshooting

#### `TESTING-GUIDE.md`
- Proyectos de prueba incluidos
- Pasos detallados de prueba
- Checklist de funcionalidades
- Casos de uso avanzados
- Métricas de éxito

### 6. **Scripts de Utilidad**

#### `install-preview.sh`
Script interactivo de instalación que:
- Verifica requisitos
- Configura variables de entorno
- Crea docker-compose.yml
- Genera scripts de inicio/parada
- Proporciona instrucciones claras

#### Scripts generados:
- `start.sh` - Iniciar OpenCode
- `stop.sh` - Detener OpenCode
- `logs.sh` - Ver logs en tiempo real
- `restart.sh` - Reiniciar OpenCode

### 7. **Proyectos de Prueba**

#### `test-projects/react-demo/`
- Aplicación React con Vite
- Contador interactivo
- Diseño moderno con gradientes
- Logs en consola
- Hot reload

#### `test-projects/python-api/`
- API FastAPI completa
- CRUD de items
- Auto-documentación (Swagger)
- Health checks
- CORS habilitado

#### `test-projects/html-static/`
- HTML/CSS/JS puro
- Sin dependencias
- Contador interactivo
- Diseño responsive

## 🚀 Cómo Funciona

### Flujo de Ejecución

```
1. Usuario abre proyecto en OpenCode
   ↓
2. Hace clic en "Ejecutar Proyecto"
   ↓
3. Preview Component envía solicitud al Preview Server
   ↓
4. Preview Server detecta tipo de proyecto
   ↓
5. Instala dependencias si es necesario
   ↓
6. Inicia el servidor de desarrollo
   ↓
7. Retorna URL del servidor
   ↓
8. Preview Component muestra la app en iframe
   ↓
9. Usuario ve su aplicación funcionando
```

### Arquitectura

```
┌─────────────────────────────────────────┐
│         OpenCode UI (React)             │
│  ┌───────────────────────────────────┐  │
│  │   Preview Component               │  │
│  │   - Iframe Manager                │  │
│  │   - Device Simulator              │  │
│  │   - Console Logger                │  │
│  │   - Navigation Bar                │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
                    ↓ HTTP
┌─────────────────────────────────────────┐
│      Preview Server (Node.js)           │
│  - Auto-detección de proyectos         │
│  - Gestión de procesos                 │
│  - API REST (/api/preview/*)           │
│  - Logs en tiempo real                 │
│  - Cache de dependencias               │
└─────────────────────────────────────────┘
                    ↓ spawn()
┌─────────────────────────────────────────┐
│         Dev Servers (Dinámicos)         │
│  - Vite (React/Vue) → :5173            │
│  - Next.js → :3000                     │
│  - FastAPI → :8000                     │
│  - Go → :8080                          │
│  - Angular → :4200                     │
│  - Flask → :5000                       │
└─────────────────────────────────────────┘
```

## 📊 Puertos Utilizados

| Puerto | Servicio | Descripción |
|--------|----------|-------------|
| 3000 | OpenCode UI | Interfaz principal de OpenCode |
| 8080 | Preview Server | API de control + archivos estáticos |
| 5173 | Vite | React, Vue, Svelte dev server |
| 4200 | Angular CLI | Angular dev server |
| 8000 | Python | FastAPI, Django |
| 5000 | Flask | Flask dev server |

## 🎯 Características Principales

### 1. Auto-Detección Inteligente
El sistema detecta automáticamente:
- Tipo de proyecto (React, Vue, Python, etc.)
- Dependencias necesarias
- Comando de inicio correcto
- Puerto apropiado

### 2. Instalación Automática
- Instala npm packages
- Instala pip packages
- Usa cache inteligente
- Muestra progreso

### 3. Vistas Responsive
- 🖥️ Desktop (100% ancho)
- 📱 Tablet (768x1024px)
- 📱 Mobile (375x667px)
- 🔄 Rotación portrait/landscape

### 4. Consola Integrada
- Captura console.log
- Captura console.error
- Captura console.warn
- Muestra logs del servidor

### 5. Hot Reload
- Cambios en archivos se reflejan automáticamente
- No requiere refresh manual
- Mantiene estado cuando es posible

### 6. Múltiples Proyectos
- Ejecuta varios proyectos simultáneamente
- Cada uno en su propio puerto
- Gestión independiente de procesos

## 🌐 Despliegue en Easypanel

### Configuración Mínima

```yaml
image: tu-usuario/opencode-evolved:latest

ports:
  - 3000:3000  # OpenCode UI
  - 8080:8080  # Preview Server
  - 5173:5173  # Dev Server

environment:
  - ANTHROPIC_API_KEY=sk-ant-...

volumes:
  - opencode-config:/root/.local/share/opencode
  - workspace:/root/workspace
  - projects:/root/projects
  - cache:/root/.cache/projects

resources:
  memory: 4Gi
  cpu: 2000m
```

### Variables de Entorno Recomendadas

```env
# API Keys (al menos una)
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
GOOGLE_API_KEY=...

# Git (opcional)
GIT_REPO_URL=https://github.com/user/repo.git
GIT_BRANCH=main

# Recursos
NODE_OPTIONS=--max-old-space-size=2048
```

## 📝 Cómo Usar

### Opción 1: Instalación Rápida

```bash
# Ejecutar el script de instalación
chmod +x install-preview.sh
./install-preview.sh

# Iniciar
./start.sh

# Acceder
http://localhost:3000
```

### Opción 2: Docker Manual

```bash
# Construir
docker build -t opencode-evolved:latest .

# Ejecutar
docker run -d \
  --name opencode \
  -p 3000:3000 \
  -p 8080:8080 \
  -p 5173:5173 \
  -e ANTHROPIC_API_KEY=tu-key \
  opencode-evolved:latest

# Acceder
http://localhost:3000
```

### Opción 3: Easypanel

1. Sigue la guía en `EASYPANEL-PREVIEW-SETUP.md`
2. Configura variables de entorno
3. Despliega
4. Accede a tu dominio

## 🧪 Probar el Sistema

### Prueba Rápida

1. **Iniciar OpenCode**
2. **Copiar proyecto de prueba**:
   ```bash
   cp -r test-projects/react-demo /root/workspace/
   ```
3. **En OpenCode**:
   - Abre el proyecto
   - Click en panel "Preview"
   - Click en "Ejecutar Proyecto"
4. **Verificar**:
   - ✅ Aplicación se muestra en el preview
   - ✅ Contador funciona
   - ✅ Logs aparecen en consola
   - ✅ Vistas responsive funcionan

### Prueba Completa

Sigue la guía detallada en `TESTING-GUIDE.md`

## 📚 Documentación

| Archivo | Descripción |
|---------|-------------|
| `PREVISUALIZADOR-PROFESIONAL.md` | Guía completa del previsualizador |
| `EASYPANEL-PREVIEW-SETUP.md` | Configuración para Easypanel |
| `TESTING-GUIDE.md` | Guía de pruebas detallada |
| `RESUMEN-PREVISUALIZADOR.md` | Este archivo (resumen general) |

## 🎓 Casos de Uso

### 1. Desarrollador Frontend
- Crea una app React
- La ejecuta en OpenCode
- Ve cambios en tiempo real
- Prueba en diferentes dispositivos

### 2. Desarrollador Backend
- Crea una API FastAPI
- La ejecuta en OpenCode
- Prueba endpoints desde Swagger
- Ve logs en la consola

### 3. Diseñador Web
- Crea HTML/CSS
- Lo visualiza inmediatamente
- Prueba responsive design
- No necesita configuración

### 4. Equipo Full-Stack
- Backend Python en `/api`
- Frontend React en `/client`
- Ambos corriendo simultáneamente
- Comunicación entre ellos

## 🔧 API del Preview Server

### Endpoints Principales

```bash
# Health check
GET /health

# Iniciar proyecto
POST /api/preview/start
Body: {"projectPath": "/root/workspace"}

# Detener proyecto
POST /api/preview/stop
Body: {"projectPath": "/root/workspace"}

# Ver estado
GET /api/preview/status?projectPath=/root/workspace

# Ver logs
GET /api/preview/logs?projectPath=/root/workspace
```

## 🎉 Resultado Final

Con este sistema, OpenCode ahora puede:

✅ **Ejecutar cualquier tipo de proyecto** sin limitaciones de terminal
✅ **Detectar automáticamente** el framework y configuración
✅ **Instalar dependencias** sin intervención manual
✅ **Mostrar previews profesionales** con vistas responsive
✅ **Capturar logs** en tiempo real
✅ **Funcionar en la nube** (Easypanel, AWS, etc.)
✅ **Soportar múltiples lenguajes** simultáneamente
✅ **Proporcionar hot reload** automático
✅ **Gestionar múltiples proyectos** a la vez

## 🚀 Próximos Pasos

1. **Probar** con los proyectos de ejemplo
2. **Desplegar** en Easypanel
3. **Crear** tus propios proyectos
4. **Disfrutar** del previsualizador profesional

## 💡 Ventajas Clave

- 🎯 **Sin configuración**: Todo es automático
- ⚡ **Rápido**: Cache inteligente de dependencias
- 🌐 **Universal**: Soporta múltiples lenguajes
- 🔒 **Seguro**: Sandbox aislado
- 📱 **Responsive**: Prueba en diferentes dispositivos
- 🐳 **Portable**: Funciona en cualquier lugar con Docker
- ☁️ **Cloud-ready**: Optimizado para Easypanel

## 🎊 ¡Listo para Usar!

El previsualizador profesional está completamente implementado y listo para usar. Solo necesitas:

1. Construir la imagen Docker
2. Configurar tus API keys
3. Iniciar el contenedor
4. ¡Empezar a crear!

**¡Disfruta de OpenCode Evolved con su nuevo previsualizador profesional! 🚀**
