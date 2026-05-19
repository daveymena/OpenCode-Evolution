# 🔗 Integración Completa - OpenCode con Previsualizador

## 🎯 Objetivo Logrado

OpenCode ahora tiene **capacidades completas de ejecución** integradas directamente en su flujo de trabajo. Ya NO es solo una terminal - es un entorno de desarrollo completo.

## 🏗️ Arquitectura de Integración

```
┌─────────────────────────────────────────────────────────────┐
│                    Usuario                                   │
│              "Crea una app React"                            │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                OpenCode AI Agent                             │
│  - Lee: .kiro/steering/opencode-capabilities.md             │
│  - Sabe: Tiene capacidades de ejecución                     │
│  - Actúa: Crea archivos + Ejecuta automáticamente           │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│              API Server (Express)                            │
│  POST /api/execute/run                                       │
│  - Detecta tipo de proyecto                                 │
│  - Instala dependencias                                      │
│  - Inicia servidor de desarrollo                            │
│  - Retorna URL y estado                                      │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│           Dev Servers (Dinámicos)                            │
│  - Vite (React/Vue) → :5173                                 │
│  - FastAPI → :8000                                           │
│  - Next.js → :3000                                           │
│  - etc...                                                    │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│              Preview Component (React)                       │
│  - Muestra la aplicación en iframe                          │
│  - Captura logs en consola                                  │
│  - Vistas responsive                                         │
│  - Navegación web completa                                  │
└─────────────────────────────────────────────────────────────┘
```

## 📋 Componentes Integrados

### 1. Steering File (`.kiro/steering/opencode-capabilities.md`)

**Propósito**: Instruir al agente OpenCode sobre sus nuevas capacidades

**Contenido clave**:
- ✅ "Ya NO eres solo una terminal"
- ✅ "Puedes ejecutar aplicaciones completas"
- ✅ Ejemplos de cómo responder
- ✅ API endpoints disponibles
- ✅ Patrones de uso

**Cómo funciona**:
- Se carga automáticamente en el contexto del agente
- El agente lo lee antes de responder
- Modifica el comportamiento del agente

### 2. API de Ejecución (`/api/execute/*`)

**Endpoints**:

#### `POST /api/execute/run`
Ejecuta un proyecto automáticamente

```typescript
// Request
{
  "projectPath": "/root/workspace/mi-proyecto",
  "projectId": 123
}

// Response
{
  "success": true,
  "type": "react",
  "url": "http://localhost:5173",
  "port": 5173,
  "pid": 12345,
  "message": "react server started successfully"
}
```

#### `GET /api/execute/status`
Verifica el estado de un proyecto

```typescript
// Request
GET /api/execute/status?projectPath=/root/workspace/mi-proyecto

// Response
{
  "running": true,
  "type": "react",
  "port": 5173,
  "pid": 12345,
  "uptime": 45000,
  "logs": ["...", "..."]
}
```

#### `GET /api/execute/logs`
Obtiene los logs de un proyecto

```typescript
// Request
GET /api/execute/logs?projectPath=/root/workspace/mi-proyecto

// Response
{
  "logs": [
    "📦 Installing dependencies...",
    "✓ Dependencies installed",
    "🚀 Starting server...",
    "✓ Server running on port 5173"
  ]
}
```

#### `POST /api/execute/stop`
Detiene un proyecto

```typescript
// Request
{
  "projectPath": "/root/workspace/mi-proyecto"
}

// Response
{
  "success": true,
  "message": "Process stopped successfully"
}
```

### 3. IdeContext Mejorado

**Función `runProject()`**:
- Llama automáticamente a `/api/execute/run`
- Maneja la respuesta
- Actualiza el estado del preview
- Fallback al sistema anterior si falla

```typescript
const runProject = useCallback(async () => {
  // 1. Llamar a la API de ejecución
  const response = await fetch('/api/execute/run', {
    method: 'POST',
    body: JSON.stringify({ projectPath, projectId })
  });
  
  // 2. Obtener URL del servidor
  const data = await response.json();
  
  // 3. Actualizar preview
  setSandboxUrl(data.url);
  setProjectLanguage(data.type);
}, [openFiles, activeProjectId]);
```

### 4. Preview Component

**Características**:
- Muestra el iframe con la aplicación
- Captura logs de console.log
- Vistas responsive (Desktop, Tablet, Mobile)
- Navegación web completa
- Botón "Ejecutar Proyecto" integrado

## 🔄 Flujo Completo de Ejecución

### Ejemplo: Usuario pide crear una app React

```
1. Usuario: "Crea una aplicación React con un contador"
   ↓
2. OpenCode AI:
   - Lee opencode-capabilities.md
   - Sabe que puede ejecutar proyectos
   - Crea los archivos:
     * src/App.jsx
     * package.json
     * vite.config.js
   ↓
3. OpenCode AI llama a la API:
   POST /api/execute/run
   {
     "projectPath": "/root/workspace/contador-app"
   }
   ↓
4. API Server:
   - Detecta que es React (package.json con "react")
   - Instala dependencias (npm install)
   - Inicia Vite (npm run dev)
   - Retorna URL: http://localhost:5173
   ↓
5. IdeContext:
   - Recibe la URL
   - Actualiza sandboxUrl
   - Abre el panel Preview
   ↓
6. Preview Component:
   - Muestra la app en iframe
   - Captura logs
   - Usuario ve la app funcionando
   ↓
7. OpenCode AI responde:
   "✅ Aplicación ejecutándose!
    📡 URL: http://localhost:5173
    🔍 Preview: Panel derecho
    
    El sistema ha:
    - ✅ Detectado proyecto React
    - ✅ Instalado dependencias
    - ✅ Iniciado servidor
    
    Puedes ver la aplicación en el panel Preview."
```

## 🎬 Ejemplos de Uso

### Ejemplo 1: App React

**Usuario**: "Crea una app React con un formulario"

**OpenCode hace**:
1. Crea archivos (App.jsx, package.json, etc.)
2. Llama a `/api/execute/run`
3. Espera respuesta
4. Informa al usuario

**Usuario ve**:
- Archivos creados en el editor
- Aplicación ejecutándose en el preview
- Logs en la consola
- Mensaje de confirmación

### Ejemplo 2: API FastAPI

**Usuario**: "Crea una API REST con FastAPI"

**OpenCode hace**:
1. Crea main.py y requirements.txt
2. Llama a `/api/execute/run`
3. Sistema detecta FastAPI
4. Instala fastapi y uvicorn
5. Inicia servidor en puerto 8000

**Usuario ve**:
- API ejecutándose
- Puede navegar a /docs para Swagger
- Logs del servidor
- Endpoints disponibles

### Ejemplo 3: HTML Estático

**Usuario**: "Crea una página web simple"

**OpenCode hace**:
1. Crea index.html
2. Sistema detecta HTML estático
3. No necesita instalación
4. Sirve directamente

**Usuario ve**:
- Página renderizada inmediatamente
- Sin espera de instalación
- Preview instantáneo

## 🔧 Configuración Necesaria

### En el Dockerfile

```dockerfile
# Instalar herramientas necesarias
RUN apt-get update && apt-get install -y \
    python3 python3-pip golang-go \
    ruby php nodejs npm \
    && rm -rf /var/lib/apt/lists/*

# Instalar gestores de paquetes
RUN npm install -g pnpm pm2 nodemon
RUN pip3 install uvicorn fastapi flask django
```

### En el entrypoint.sh

```bash
# Iniciar API server con rutas de ejecución
node artifacts/api-server/dist/index.js &

# Workspace disponible
export WORKSPACE=/root/workspace
```

### Variables de Entorno

```env
# API Keys (al menos una)
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...

# Workspace
WORKSPACE=/root/workspace

# Puertos
API_PORT=3001
PREVIEW_PORT=8080
```

## 📊 Detección Automática

El sistema detecta automáticamente:

### Node.js Projects
```javascript
// package.json con:
"dependencies": {
  "react": "..." → React (puerto 5173)
  "vue": "..." → Vue (puerto 5173)
  "next": "..." → Next.js (puerto 3000)
  "express": "..." → Express (puerto 3000)
}
```

### Python Projects
```python
# requirements.txt con:
fastapi → FastAPI (puerto 8000)
django → Django (puerto 8000)
flask → Flask (puerto 5000)
```

### Go Projects
```go
// go.mod presente → Go (puerto 8080)
```

### Static Files
```html
<!-- index.html presente → Static (puerto 8080) -->
```

## 🎯 Ventajas de la Integración

### Para el Usuario:
1. **Experiencia fluida**: Pide algo y lo ve funcionando
2. **Sin configuración**: Todo automático
3. **Feedback inmediato**: Ve la app en segundos
4. **Logs visibles**: Puede debuggear fácilmente

### Para OpenCode (el agente):
1. **Más capaz**: Puede ejecutar, no solo crear
2. **Mejor UX**: Proporciona experiencia completa
3. **Menos limitaciones**: No dice "no puedo"
4. **Más autónomo**: Hace todo el flujo completo

### Para el Sistema:
1. **Modular**: Cada componente independiente
2. **Escalable**: Soporta múltiples proyectos
3. **Extensible**: Fácil agregar más lenguajes
4. **Robusto**: Manejo de errores completo

## 🚀 Cómo Probar

### 1. Compilar

```bash
pnpm run build
```

### 2. Iniciar API Server

```bash
cd artifacts/api-server
node dist/index.js
```

### 3. Iniciar Frontend

```bash
cd artifacts/opencode-evolved/dist/public
python -m http.server 3000
```

### 4. Probar la API

```bash
# Health check
curl http://localhost:3001/api/health

# Ejecutar proyecto de prueba
curl -X POST http://localhost:3001/api/execute/run \
  -H "Content-Type: application/json" \
  -d '{"projectPath": "./test-projects/react-demo"}'

# Ver estado
curl "http://localhost:3001/api/execute/status?projectPath=./test-projects/react-demo"
```

### 5. Usar OpenCode

1. Abre http://localhost:3000
2. Pide: "Crea una app React con un contador"
3. OpenCode creará los archivos
4. OpenCode ejecutará automáticamente
5. Verás la app en el preview

## 📝 Checklist de Integración

- [x] Steering file creado (`.kiro/steering/opencode-capabilities.md`)
- [x] API de ejecución implementada (`/api/execute/*`)
- [x] IdeContext actualizado con `runProject()`
- [x] Preview Component con vistas responsive
- [x] Detección automática de proyectos
- [x] Instalación automática de dependencias
- [x] Gestión de procesos
- [x] Captura de logs
- [x] Documentación completa
- [x] Proyectos de prueba
- [x] Scripts de inicio

## 🎉 Resultado Final

**OpenCode ahora es un IDE completo en la nube que puede**:

✅ Crear proyectos de cualquier lenguaje
✅ Instalar dependencias automáticamente
✅ Ejecutar servidores de desarrollo
✅ Mostrar previews en tiempo real
✅ Capturar y mostrar logs
✅ Soportar múltiples proyectos simultáneamente
✅ Funcionar completamente en la nube
✅ Proporcionar una experiencia de desarrollo completa

**Ya NO dice**: "No puedo ejecutar esto porque soy una terminal"

**Ahora dice**: "✅ Proyecto ejecutándose! Puedes verlo en el panel Preview"

---

**¡La integración está completa y lista para usar!** 🚀
