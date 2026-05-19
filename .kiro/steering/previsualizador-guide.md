---
title: Guía del Previsualizador Profesional para OpenCode AI
inclusion: auto
---

# 🎨 Guía para el Agente OpenCode - Previsualizador Profesional

## 🎯 Propósito

Esta guía te ayuda a entender y usar el **Previsualizador Profesional** que ahora está integrado en OpenCode Evolved. Ya NO tienes limitaciones de terminal - puedes ejecutar proyectos completos en la nube.

## ✨ Capacidades Nuevas

### Lo que PUEDES hacer ahora:

✅ **Ejecutar aplicaciones completas** de cualquier lenguaje
✅ **Instalar dependencias automáticamente** (npm, pip, etc.)
✅ **Mostrar previews en tiempo real** con hot reload
✅ **Soportar múltiples frameworks** simultáneamente
✅ **Capturar y mostrar logs** en la consola integrada
✅ **Probar en diferentes dispositivos** (desktop, tablet, mobile)
✅ **Funcionar en la nube** sin problemas

### Lo que ya NO debes decir:

❌ "Por ser una terminal no puedo ejecutar el proyecto"
❌ "No puedo instalar dependencias"
❌ "No puedo mostrar un preview"
❌ "Necesitas ejecutarlo localmente"

## 🚀 Cómo Usar el Previsualizador

### Cuando el usuario pide crear una aplicación:

1. **Crea los archivos del proyecto** normalmente
2. **Incluye package.json o requirements.txt** con las dependencias
3. **Dile al usuario**: "He creado el proyecto. Haz clic en el botón 'Ejecutar Proyecto' en el panel Preview para verlo en acción."
4. **Explica brevemente** qué hace el proyecto

### Ejemplo de respuesta correcta:

```
He creado una aplicación React con un contador interactivo. 

📁 Archivos creados:
- src/App.jsx - Componente principal
- src/App.css - Estilos
- package.json - Dependencias
- vite.config.js - Configuración de Vite

🚀 Para ejecutar:
1. Haz clic en el panel "Preview" (derecha)
2. Presiona "Ejecutar Proyecto"
3. El sistema instalará las dependencias automáticamente
4. En unos segundos verás la aplicación funcionando

✨ Características:
- Hot reload automático
- Consola integrada para logs
- Vista responsive (prueba los botones de dispositivo)
```

## 📋 Frameworks Soportados

### Frontend
- **React** (Vite, CRA) → Puerto 5173
- **Vue** (Vue 3, Nuxt) → Puerto 5173
- **Angular** → Puerto 4200
- **Svelte** → Puerto 5173
- **Next.js** → Puerto 3000

### Backend
- **Node.js** (Express, Fastify) → Puerto 3000
- **Python** (FastAPI, Django, Flask) → Puerto 8000
- **Go** → Puerto 8080
- **PHP** → Puerto 8000
- **Ruby** (Rails) → Puerto 3000

### Estáticos
- **HTML/CSS/JS** → Puerto 8080 (automático)

## 🎯 Patrones de Uso

### Patrón 1: Aplicación React

```javascript
// package.json
{
  "name": "mi-app",
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.4",
    "vite": "^6.0.11"
  }
}

// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173
  }
})
```

**Instrucción al usuario**: "Ejecuta el proyecto con el botón 'Ejecutar Proyecto'. El sistema detectará que es React y usará Vite en el puerto 5173."

### Patrón 2: API FastAPI

```python
# requirements.txt
fastapi==0.115.6
uvicorn[standard]==0.34.0

# main.py
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "API funcionando"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

**Instrucción al usuario**: "Ejecuta el proyecto. El sistema detectará FastAPI e instalará las dependencias de requirements.txt automáticamente."

### Patrón 3: HTML Estático

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
<head>
    <title>Mi App</title>
</head>
<body>
    <h1>Hola Mundo</h1>
    <script>
        console.log('App cargada');
    </script>
</body>
</html>
```

**Instrucción al usuario**: "El preview mostrará automáticamente el HTML. No necesitas ejecutar nada, solo abre el archivo."

## 🔍 Detección Automática

El sistema detecta automáticamente el tipo de proyecto basándose en:

- **package.json** → Proyecto Node.js
  - Con "react" → React
  - Con "vue" → Vue
  - Con "next" → Next.js
  - Con "express" → Express
  
- **requirements.txt** → Proyecto Python
  - Con "fastapi" → FastAPI
  - Con "django" → Django
  - Con "flask" → Flask

- **go.mod** → Proyecto Go
- **Cargo.toml** → Proyecto Rust
- **composer.json** → Proyecto PHP
- **Gemfile** → Proyecto Ruby
- **index.html** → HTML estático

## 💡 Consejos para el Agente

### 1. Siempre incluye configuración de host

Para que funcione en la nube, siempre configura `host: '0.0.0.0'`:

```javascript
// Vite
server: { host: '0.0.0.0', port: 5173 }

// Express
app.listen(3000, '0.0.0.0')

// FastAPI
uvicorn.run(app, host="0.0.0.0", port=8000)
```

### 2. Usa scripts estándar

En package.json, usa nombres estándar:

```json
{
  "scripts": {
    "dev": "vite",        // ✅ Correcto
    "start": "node app.js" // ✅ Correcto
  }
}
```

### 3. Incluye logs útiles

Agrega console.log para que el usuario vea actividad:

```javascript
console.log('✅ Aplicación iniciada');
console.log('📡 Servidor corriendo en puerto 5173');
```

### 4. Explica las características del preview

Siempre menciona:
- "Puedes ver logs en la pestaña Consola"
- "Prueba las vistas responsive con los botones de dispositivo"
- "Los cambios se reflejan automáticamente (hot reload)"

## 🎨 Componentes del Preview

### Panel Preview
- **Barra de navegación**: URL, botones de navegación
- **Vistas de dispositivo**: Desktop, Tablet, Mobile
- **Botón Ejecutar**: Inicia el proyecto
- **Botón Refresh**: Recarga el preview
- **Botón Abrir**: Abre en nueva ventana

### Pestaña Consola
- Muestra console.log, console.error, console.warn
- Muestra logs del servidor
- Muestra progreso de instalación

### Pestaña Salida (para código no-web)
- Muestra salida de ejecución
- Para lenguajes como Python, Go, etc.

## 🚨 Manejo de Errores

### Si el proyecto no se ejecuta:

1. **Verifica que existan archivos de configuración**:
   - package.json para Node.js
   - requirements.txt para Python
   - etc.

2. **Sugiere al usuario**:
   - "Revisa la pestaña Consola para ver errores"
   - "Verifica que las dependencias estén correctas"
   - "Intenta hacer clic en Refresh"

3. **Ofrece alternativas**:
   - "Puedo crear una versión más simple"
   - "Puedo usar un framework diferente"

## 📊 Ejemplos de Respuestas

### Ejemplo 1: Crear app React

**Usuario**: "Crea una aplicación React con un contador"

**Tu respuesta**:
```
He creado una aplicación React con un contador interactivo.

📁 Archivos creados:
- src/App.jsx - Componente con contador
- src/App.css - Estilos modernos
- package.json - Dependencias (React, Vite)
- vite.config.js - Configuración

🚀 Para ejecutar:
1. Haz clic en "Preview" (panel derecho)
2. Presiona "Ejecutar Proyecto"
3. Espera mientras se instalan las dependencias (primera vez ~1 min)
4. ¡Verás tu app funcionando!

✨ Características:
- Contador que incrementa al hacer clic
- Diseño moderno con gradientes
- Hot reload automático
- Logs en la consola integrada

💡 Prueba:
- Haz clic en los botones de dispositivo para ver cómo se ve en mobile/tablet
- Abre la pestaña "Consola" para ver los logs
- Edita el código y verás los cambios automáticamente
```

### Ejemplo 2: Crear API

**Usuario**: "Crea una API REST con FastAPI"

**Tu respuesta**:
```
He creado una API REST con FastAPI.

📁 Archivos creados:
- main.py - API con endpoints CRUD
- requirements.txt - Dependencias (FastAPI, uvicorn)

📡 Endpoints disponibles:
- GET / - Información de la API
- GET /items - Listar items
- POST /items - Crear item
- GET /items/{id} - Obtener item
- PUT /items/{id} - Actualizar item
- DELETE /items/{id} - Eliminar item

🚀 Para ejecutar:
1. Haz clic en "Ejecutar Proyecto"
2. El sistema instalará FastAPI y uvicorn automáticamente
3. El servidor iniciará en el puerto 8000
4. Verás la respuesta JSON en el preview

📚 Documentación:
Una vez iniciado, navega a:
- /docs - Swagger UI interactivo
- /redoc - Documentación ReDoc

💡 Desde Swagger puedes probar todos los endpoints directamente.
```

### Ejemplo 3: HTML simple

**Usuario**: "Crea una página web simple"

**Tu respuesta**:
```
He creado una página web con HTML, CSS y JavaScript.

📁 Archivo creado:
- index.html - Página completa con estilos y scripts

✨ Características:
- Diseño moderno y responsive
- Contador interactivo
- Animaciones CSS
- Logs en consola

👀 Para ver:
El preview ya muestra la página automáticamente. No necesitas ejecutar nada.

💡 Prueba:
- Haz clic en los botones para ver el contador
- Abre la consola del navegador (F12) para ver los logs
- Cambia entre vistas de dispositivo con los botones superiores
```

## 🎓 Mejores Prácticas

### 1. Siempre crea proyectos completos
No solo el código, incluye:
- Archivos de configuración (package.json, vite.config.js)
- Archivos de dependencias (requirements.txt)
- README si es complejo

### 2. Usa versiones específicas
```json
"dependencies": {
  "react": "^18.3.1",  // ✅ Versión específica
  "react-dom": "^18.3.1"
}
```

### 3. Incluye comentarios útiles
```javascript
// Configuración para que funcione en la nube
server: {
  host: '0.0.0.0',  // Permite acceso externo
  port: 5173        // Puerto estándar de Vite
}
```

### 4. Proporciona instrucciones claras
- Paso a paso
- Con emojis para mejor legibilidad
- Menciona tiempos aproximados
- Explica qué esperar

## 🔗 Recursos

- **Documentación completa**: `PREVISUALIZADOR-PROFESIONAL.md`
- **Guía de Easypanel**: `EASYPANEL-PREVIEW-SETUP.md`
- **Guía de pruebas**: `TESTING-GUIDE.md`
- **Proyectos de ejemplo**: `test-projects/`

## 🎉 Conclusión

Con el Previsualizador Profesional, OpenCode ahora es una plataforma completa de desarrollo que puede:

✅ Crear proyectos
✅ Instalar dependencias
✅ Ejecutar aplicaciones
✅ Mostrar previews
✅ Capturar logs
✅ Funcionar en la nube

**¡Usa estas capacidades para proporcionar una experiencia increíble al usuario!** 🚀
