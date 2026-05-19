# 🎯 Cómo Funciona Todo - OpenCode Evolved

## 🌐 Sistema Completo Ejecutándose

### ✅ Servicios Activos:

1. **Frontend (OpenCode UI)**: http://localhost:3000
   - Interfaz de usuario de OpenCode
   - Chat con el agente AI
   - Editor de código
   - **Panel Preview** (derecha)

2. **Backend (API Server)**: http://localhost:3001
   - API REST
   - Gestión de proyectos
   - **API de Ejecución** (`/api/execute/*`)
   - Base de datos

## 🔄 Flujo Completo: Usuario → OpenCode → Preview

### Paso 1: Usuario Interactúa

```
Usuario abre: http://localhost:3000
├─ Ve la interfaz de OpenCode
├─ Escribe en el chat: "Crea una app React con un contador"
└─ Presiona Enter
```

### Paso 2: OpenCode AI Procesa

```
OpenCode AI (agente):
├─ Lee automáticamente: .kiro/steering/opencode-capabilities.md
├─ Sabe que PUEDE ejecutar proyectos
├─ Crea los archivos:
│   ├─ src/App.jsx
│   ├─ package.json
│   ├─ vite.config.js
│   └─ index.html
└─ Llama a la API de ejecución
```

### Paso 3: API Ejecuta el Proyecto

```
POST http://localhost:3001/api/execute/run
Body: {"projectPath": "/root/workspace/mi-app"}

API Server:
├─ Detecta tipo: "react" (por package.json)
├─ Instala dependencias: npm install
├─ Inicia servidor: npm run dev
├─ Puerto: 5173
└─ Retorna: {"url": "http://localhost:5173", "type": "react"}
```

### Paso 4: Preview Muestra la App

```
Preview Component (en el frontend):
├─ Recibe la URL: http://localhost:5173
├─ Muestra en iframe
├─ Captura logs de console.log
├─ Habilita vistas responsive
└─ Usuario ve su app funcionando
```

### Paso 5: OpenCode Responde

```
OpenCode AI responde en el chat:
"✅ Aplicación React ejecutándose!

📡 URL: http://localhost:5173
🔍 Preview: Panel derecho
📊 Logs: Pestaña 'Consola'

El sistema ha:
- ✅ Detectado proyecto React
- ✅ Instalado dependencias
- ✅ Iniciado servidor Vite
- ✅ Configurado hot reload

Puedes ver la aplicación en el panel Preview."
```

## 🎨 Interfaz de OpenCode

```
┌─────────────────────────────────────────────────────────────┐
│  OpenCode Evolved                                    [≡] [×] │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────┬─────────────────────────────────┐  │
│  │                     │                                 │  │
│  │   CHAT              │   PREVIEW                       │  │
│  │   (Izquierda)       │   (Derecha)                     │  │
│  │                     │                                 │  │
│  │  Usuario:           │  ┌─────────────────────────┐   │  │
│  │  "Crea una app      │  │ [←] [→] [⟳] [URL Bar]  │   │  │
│  │   React"            │  ├─────────────────────────┤   │  │
│  │                     │  │                         │   │  │
│  │  OpenCode:          │  │   [🖥️] [📱] [📱]        │   │  │
│  │  "✅ Creando..."    │  │                         │   │  │
│  │                     │  │   ┌─────────────────┐   │   │  │
│  │  [Archivos creados] │  │   │                 │   │   │  │
│  │  - App.jsx          │  │   │  TU APP AQUÍ    │   │   │  │
│  │  - package.json     │  │   │  (iframe)       │   │   │  │
│  │                     │  │   │                 │   │   │  │
│  │  "🚀 Ejecutando..." │  │   └─────────────────┘   │   │  │
│  │                     │  │                         │   │  │
│  │  "✅ App corriendo" │  │  [Preview] [Consola]    │   │  │
│  │                     │  └─────────────────────────┘   │  │
│  │                     │                                 │  │
│  └─────────────────────┴─────────────────────────────────┘  │
│                                                               │
│  [Escribe tu mensaje aquí...]                    [Enviar]    │
└─────────────────────────────────────────────────────────────┘
```

## 🔧 Componentes Clave

### 1. Frontend (`artifacts/opencode-evolved/`)

**Archivos importantes**:
- `src/pages/ChatPage.tsx` - Página principal con chat
- `src/components/ide/Preview.tsx` - **Panel de preview**
- `src/contexts/IdeContext.tsx` - Gestión de estado
- `src/components/chat/MessageList.tsx` - Chat con OpenCode

**Preview Component** tiene:
- Navegador web completo
- Vistas responsive (Desktop, Tablet, Mobile)
- Consola integrada para logs
- Botón "Ejecutar Proyecto"

### 2. Backend (`artifacts/api-server/`)

**Rutas importantes**:
- `src/routes/execute.ts` - **API de ejecución** (NUEVO)
- `src/routes/projects.ts` - Gestión de proyectos
- `src/routes/messages.ts` - Chat con OpenCode
- `src/routes/opencode.ts` - Integración con OpenCode AI

**API de Ejecución** (`/api/execute/*`):
- `POST /run` - Ejecutar proyecto
- `GET /status` - Ver estado
- `GET /logs` - Ver logs
- `POST /stop` - Detener

### 3. Steering Files (`.kiro/steering/`)

**Archivos que OpenCode lee automáticamente**:
- `opencode-capabilities.md` - **Instruye al agente**
- `previsualizador-guide.md` - Guía detallada

Estos archivos le dicen a OpenCode:
- "Ya NO eres solo una terminal"
- "PUEDES ejecutar proyectos"
- "Usa la API /api/execute/run"
- "Informa al usuario con URLs"

## 🎬 Ejemplo Real de Uso

### Escenario: Usuario pide crear una app React

**1. Usuario escribe en el chat:**
```
"Crea una aplicación React con un contador que incremente al hacer clic"
```

**2. OpenCode AI (internamente):**
```javascript
// Lee el steering file
const capabilities = readSteeringFile('opencode-capabilities.md');
// Sabe que puede ejecutar

// Crea los archivos
createFile('src/App.jsx', `
  import { useState } from 'react'
  function App() {
    const [count, setCount] = useState(0)
    return (
      <div>
        <h1>Contador: {count}</h1>
        <button onClick={() => setCount(count + 1)}>
          Incrementar
        </button>
      </div>
    )
  }
  export default App
`);

createFile('package.json', {
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "vite": "^6.0.11",
    "@vitejs/plugin-react": "^4.3.4"
  },
  "scripts": {
    "dev": "vite"
  }
});

// Ejecuta el proyecto
const response = await fetch('http://localhost:3001/api/execute/run', {
  method: 'POST',
  body: JSON.stringify({
    projectPath: '/root/workspace/contador-app'
  })
});

const result = await response.json();
// result = {
//   "success": true,
//   "type": "react",
//   "url": "http://localhost:5173",
//   "port": 5173
// }
```

**3. OpenCode AI responde en el chat:**
```
He creado una aplicación React con un contador interactivo.

📁 Archivos creados:
- src/App.jsx - Componente con contador
- package.json - Dependencias
- vite.config.js - Configuración

🚀 Ejecutando el proyecto...

✅ Aplicación ejecutándose!

📡 URL: http://localhost:5173
🔍 Preview: Panel derecho
📊 Logs: Pestaña "Consola"

El sistema ha:
- ✅ Detectado proyecto React
- ✅ Instalado dependencias (react, vite)
- ✅ Iniciado servidor de desarrollo
- ✅ Configurado hot reload

Puedes ver la aplicación funcionando en el panel Preview.
Haz clic en el botón para incrementar el contador.
```

**4. Usuario ve:**
- Archivos en el editor (izquierda)
- App funcionando en el preview (derecha)
- Logs en la consola
- Puede interactuar con el contador

## 🎯 Lo Importante

### OpenCode YA NO dice:
❌ "No puedo ejecutar esto porque soy una terminal"
❌ "Necesitas ejecutarlo localmente"
❌ "No tengo acceso a un entorno de ejecución"

### OpenCode AHORA dice:
✅ "Voy a ejecutar el proyecto"
✅ "Instalando dependencias..."
✅ "Aplicación ejecutándose en el preview"
✅ "Puedes verla en el panel derecho"

## 🚀 Cómo Acceder Ahora

### Opción 1: Navegador
```
1. Abre: http://localhost:3000
2. Verás la interfaz de OpenCode
3. Escribe en el chat
4. OpenCode creará y ejecutará automáticamente
5. Verás el resultado en el panel Preview
```

### Opción 2: API Directa
```bash
# Ejecutar un proyecto
curl -X POST http://localhost:3001/api/execute/run \
  -H "Content-Type: application/json" \
  -d '{"projectPath": "./test-projects/react-demo"}'

# Ver estado
curl http://localhost:3001/api/execute/status?projectPath=./test-projects/react-demo

# Ver logs
curl http://localhost:3001/api/execute/logs?projectPath=./test-projects/react-demo
```

## 📊 Estado Actual del Sistema

```
✅ Frontend: http://localhost:3000 (CORRIENDO)
✅ Backend:  http://localhost:3001 (CORRIENDO)
✅ Preview:  Integrado en el frontend
✅ API:      /api/execute/* disponible
✅ Steering: OpenCode sabe que puede ejecutar
✅ Proyectos de prueba: Listos
```

## 🎉 Resumen

**OpenCode Evolved es ahora un IDE completo en la nube que**:

1. ✅ Tiene una interfaz web (frontend)
2. ✅ Tiene un agente AI (OpenCode) que entiende lenguaje natural
3. ✅ Puede crear archivos de código
4. ✅ Puede ejecutar proyectos automáticamente
5. ✅ Puede instalar dependencias
6. ✅ Puede mostrar previews en tiempo real
7. ✅ Puede capturar logs
8. ✅ Funciona con múltiples lenguajes

**Todo está integrado y funcionando! 🚀**

---

**Accede ahora**: http://localhost:3000
