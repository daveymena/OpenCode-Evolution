# 🎨 Previsualizador Profesional - OpenCode Evolved

## 📋 Descripción

El **Previsualizador Profesional** es un sistema avanzado integrado en OpenCode que permite ejecutar y visualizar aplicaciones de **cualquier lenguaje y framework** directamente en la nube, sin las limitaciones de una terminal tradicional.

## ✨ Características Principales

### 🌐 Soporte Multi-Lenguaje

El previsualizador detecta automáticamente y ejecuta proyectos en:

#### Frontend Frameworks
- ⚛️ **React** (Vite, Create React App)
- 🖖 **Vue.js** (Vue 3, Nuxt)
- 🅰️ **Angular**
- 🔥 **Svelte / SvelteKit**
- ⚡ **Next.js**
- 🎨 **Gatsby**

#### Backend Frameworks
- 🟢 **Node.js** (Express, Fastify, Koa)
- 🐍 **Python** (FastAPI, Django, Flask)
- 🐹 **Go** (Gin, Echo, Chi)
- 🦀 **Rust** (Actix, Rocket)
- 💎 **Ruby** (Rails, Sinatra)
- 🐘 **PHP** (Laravel, Symfony)

#### Archivos Estáticos
- 📄 **HTML/CSS/JavaScript**
- 📝 **Markdown** (con renderizado)
- 🎨 **CSS** (con preview interactivo)

### 📱 Modos de Visualización

1. **Desktop** (Monitor) - Vista completa de escritorio
2. **Tablet** (iPad, Android tablets) - 768x1024px
3. **Mobile** (iPhone, Android phones) - 375x667px
4. **Orientación** - Portrait / Landscape

### 🔧 Funcionalidades Avanzadas

- ✅ **Auto-detección** de tipo de proyecto
- ✅ **Instalación automática** de dependencias
- ✅ **Hot-reload** en tiempo real
- ✅ **Consola integrada** para logs y errores
- ✅ **Navegador web** con historial
- ✅ **Ejecución en sandbox** segura
- ✅ **Múltiples puertos** simultáneos
- ✅ **Cache inteligente** de node_modules

## 🚀 Cómo Usar

### 1. Desde la Interfaz

1. Abre tu proyecto en OpenCode
2. Haz clic en el panel **"Preview"** (derecha)
3. Presiona el botón **"Ejecutar Proyecto"**
4. El sistema detectará automáticamente el tipo de proyecto
5. Instalará dependencias si es necesario
6. Iniciará el servidor de desarrollo
7. Mostrará la aplicación en el iframe

### 2. Cambiar Modo de Vista

- Haz clic en los iconos de dispositivo en la barra superior:
  - 🖥️ **Monitor** - Vista desktop completa
  - 📱 **Tablet** - Vista tablet (768x1024)
  - 📱 **Mobile** - Vista móvil (375x667)
- Usa el botón de **rotación** para cambiar orientación

### 3. Ver Logs y Consola

- Haz clic en la pestaña **"Consola"** para ver:
  - Logs del servidor
  - Errores de compilación
  - Mensajes de la aplicación
  - Estado de instalación de dependencias

### 4. Navegación Web

- Escribe URLs en la barra de direcciones
- Usa los botones de navegación (← →)
- Refresca con el botón 🔄
- Abre en nueva ventana con el botón ↗️

## 🏗️ Arquitectura

### Componentes

```
┌─────────────────────────────────────────┐
│         OpenCode UI (React)             │
│  ┌───────────────────────────────────┐  │
│  │   Preview Component               │  │
│  │   - Iframe Manager                │  │
│  │   - Device Simulator              │  │
│  │   - Console Logger                │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│      Preview Server (Node.js)           │
│  - Auto-detección de proyectos         │
│  - Gestión de procesos                 │
│  - API REST para control               │
│  - Logs en tiempo real                 │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         Dev Servers (Dinámicos)         │
│  - Vite (React/Vue) → :5173            │
│  - Next.js → :3000                     │
│  - FastAPI → :8000                     │
│  - Go → :8080                          │
│  - Etc...                              │
└─────────────────────────────────────────┘
```

### Puertos Expuestos

| Puerto | Servicio | Descripción |
|--------|----------|-------------|
| 3000 | OpenCode UI | Interfaz principal |
| 5173 | Vite Dev Server | React, Vue, Svelte |
| 8080 | Preview Server | API de control + estáticos |
| 4200 | Angular | Angular CLI |
| 8000 | Python | FastAPI, Django |
| 5000 | Flask | Flask dev server |

## 🐳 Despliegue en Easypanel

### Configuración Básica

1. **Crear nueva aplicación** en Easypanel
2. **Tipo**: Docker
3. **Imagen**: Tu imagen personalizada
4. **Puertos a exponer**:
   ```
   3000 → OpenCode UI (principal)
   8080 → Preview Server
   5173 → Dev Server (opcional)
   ```

### Variables de Entorno

```env
# API Keys (al menos una requerida)
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
GOOGLE_API_KEY=...
OPENCODE_API_KEY=...

# Git (opcional)
GIT_REPO_URL=https://github.com/user/repo.git
GIT_BRANCH=main
GIT_USER_NAME=OpenCode
GIT_USER_EMAIL=bot@opencode.local

# OpenClaw (opcional)
OPENCLAW_GATEWAY_TOKEN=tu-token-secreto
TELEGRAM_BOT_TOKEN=...
```

### Volúmenes Persistentes

```yaml
volumes:
  - /root/.local/share/opencode  # Configuración de OpenCode
  - /root/workspace              # Código del proyecto
  - /root/projects               # Proyectos guardados
  - /root/.cache/projects        # Cache de node_modules
```

### Ejemplo docker-compose.yml

```yaml
version: '3.8'

services:
  opencode:
    image: tu-usuario/opencode-evolved:latest
    ports:
      - "3000:3000"   # OpenCode UI
      - "8080:8080"   # Preview Server
      - "5173:5173"   # Vite Dev
      - "4200:4200"   # Angular
      - "8000:8000"   # Python
    environment:
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
      - GIT_REPO_URL=${GIT_REPO_URL}
    volumes:
      - opencode-config:/root/.local/share/opencode
      - workspace:/root/workspace
      - projects:/root/projects
      - cache:/root/.cache/projects
    restart: unless-stopped

volumes:
  opencode-config:
  workspace:
  projects:
  cache:
```

## 🔌 API del Preview Server

### Endpoints Disponibles

#### `POST /api/preview/start`
Inicia un proyecto detectando automáticamente el tipo.

```bash
curl -X POST http://localhost:8080/api/preview/start \
  -H "Content-Type: application/json" \
  -d '{"projectPath": "/root/workspace"}'
```

**Respuesta:**
```json
{
  "success": true,
  "type": "react",
  "url": "http://localhost:5173",
  "port": 5173,
  "pid": 12345
}
```

#### `POST /api/preview/stop`
Detiene un proyecto en ejecución.

```bash
curl -X POST http://localhost:8080/api/preview/stop \
  -H "Content-Type: application/json" \
  -d '{"projectPath": "/root/workspace"}'
```

#### `GET /api/preview/status`
Obtiene el estado de un proyecto.

```bash
curl "http://localhost:8080/api/preview/status?projectPath=/root/workspace"
```

**Respuesta:**
```json
{
  "running": true,
  "type": "react",
  "port": 5173,
  "pid": 12345,
  "uptime": 45000,
  "logs": ["...", "..."]
}
```

#### `GET /api/preview/logs`
Obtiene los logs de un proyecto.

```bash
curl "http://localhost:8080/api/preview/logs?projectPath=/root/workspace"
```

## 🛠️ Solución de Problemas

### El proyecto no se ejecuta

1. **Verifica que existan archivos de configuración**:
   - `package.json` para Node.js
   - `requirements.txt` para Python
   - `go.mod` para Go
   - etc.

2. **Revisa los logs**:
   - Pestaña "Consola" en el preview
   - `/tmp/preview.log` en el contenedor
   - `/tmp/dev.log` para dev servers

3. **Verifica las dependencias**:
   ```bash
   # Dentro del contenedor
   cd /root/workspace
   npm install  # o pip install, etc.
   ```

### El preview muestra pantalla en blanco

1. **Verifica el puerto correcto**:
   - React/Vue/Svelte: 5173
   - Next.js: 3000
   - Angular: 4200

2. **Revisa la consola del navegador** (F12)

3. **Intenta refrescar** con el botón 🔄

### Dependencias no se instalan

1. **Verifica espacio en disco**:
   ```bash
   df -h
   ```

2. **Limpia cache**:
   ```bash
   rm -rf /root/.cache/projects/*
   ```

3. **Reinstala manualmente**:
   ```bash
   cd /root/workspace
   rm -rf node_modules package-lock.json
   npm install
   ```

## 📚 Ejemplos de Uso

### Ejemplo 1: Proyecto React

```bash
# El sistema detecta automáticamente:
# - package.json con "react" en dependencies
# - Ejecuta: npm run dev
# - Puerto: 5173
# - URL: http://localhost:5173
```

### Ejemplo 2: API FastAPI

```bash
# El sistema detecta:
# - requirements.txt con "fastapi"
# - Ejecuta: uvicorn main:app --reload --host 0.0.0.0
# - Puerto: 8000
# - URL: http://localhost:8000
```

### Ejemplo 3: HTML Estático

```bash
# El sistema detecta:
# - index.html en la raíz
# - Sirve archivos estáticos
# - Puerto: 8080
# - URL: http://localhost:8080/static
```

## 🎯 Mejores Prácticas

1. **Usa scripts estándar** en `package.json`:
   ```json
   {
     "scripts": {
       "dev": "vite",
       "start": "node server.js"
     }
   }
   ```

2. **Configura el host** en `0.0.0.0` para acceso externo:
   ```js
   // vite.config.js
   export default {
     server: {
       host: '0.0.0.0',
       port: 5173
     }
   }
   ```

3. **Usa variables de entorno** para configuración:
   ```env
   PORT=5173
   HOST=0.0.0.0
   NODE_ENV=development
   ```

4. **Mantén las dependencias actualizadas** en cache

## 🔐 Seguridad

- ✅ Sandbox con permisos limitados
- ✅ Aislamiento de procesos
- ✅ No ejecución de código arbitrario sin confirmación
- ✅ Logs auditables
- ✅ Límites de recursos (memoria, CPU)

## 📈 Rendimiento

- **Cache inteligente**: node_modules compartidos entre proyectos
- **Lazy loading**: Solo inicia servidores cuando se necesitan
- **Auto-cleanup**: Detiene procesos inactivos
- **Límites de memoria**: NODE_OPTIONS configurado para optimizar uso

## 🤝 Contribuir

¿Quieres agregar soporte para más lenguajes o frameworks?

1. Edita `preview-server.js`
2. Agrega detección en `detectProjectType()`
3. Configura comando y puerto
4. Prueba y envía PR

## 📞 Soporte

- 📧 Email: support@opencode.ai
- 💬 Discord: [OpenCode Community]
- 📖 Docs: https://docs.opencode.ai

---

**¡Disfruta del Previsualizador Profesional de OpenCode! 🚀**
