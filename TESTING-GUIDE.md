# 🧪 Guía de Pruebas - Previsualizador Profesional

## 📋 Proyectos de Prueba Incluidos

Hemos creado 3 proyectos de demostración para probar el previsualizador:

### 1. 🎨 React Demo (`test-projects/react-demo/`)
- **Framework**: React + Vite
- **Puerto**: 5173
- **Características**:
  - Contador interactivo
  - Hot reload
  - Logs en consola
  - Diseño responsive
  - Gradientes y animaciones

### 2. 🐍 Python API (`test-projects/python-api/`)
- **Framework**: FastAPI
- **Puerto**: 8000
- **Características**:
  - API RESTful completa
  - Auto-documentación (Swagger)
  - CRUD de items
  - Health checks
  - CORS habilitado

### 3. 📄 HTML Estático (`test-projects/html-static/`)
- **Tipo**: HTML/CSS/JavaScript puro
- **Puerto**: 8080 (servidor estático)
- **Características**:
  - Sin dependencias
  - Contador interactivo
  - Logs en consola
  - Diseño moderno

## 🚀 Cómo Probar

### Opción A: Prueba Local con Docker

1. **Construir la imagen**:
```bash
docker build -t opencode-evolved:latest .
```

2. **Ejecutar el contenedor**:
```bash
docker run -d \
  --name opencode-test \
  -p 3000:3000 \
  -p 8080:8080 \
  -p 5173:5173 \
  -p 8000:8000 \
  -e ANTHROPIC_API_KEY=tu-api-key \
  -v $(pwd)/test-projects:/root/workspace \
  opencode-evolved:latest
```

3. **Acceder a OpenCode**:
```
http://localhost:3000
```

### Opción B: Prueba con Docker Compose

1. **Usar el script de instalación**:
```bash
chmod +x install-preview.sh
./install-preview.sh
```

2. **Iniciar**:
```bash
./start.sh
```

3. **Acceder**:
```
http://localhost:3000
```

### Opción C: Prueba en Easypanel

Sigue la guía completa en `EASYPANEL-PREVIEW-SETUP.md`

## 📝 Pasos de Prueba Detallados

### Prueba 1: React Demo

1. **Abrir OpenCode** en `http://localhost:3000`

2. **Crear un nuevo proyecto** o abrir el workspace

3. **Copiar los archivos** de `test-projects/react-demo/` al workspace

4. **En la interfaz de OpenCode**:
   - Abre el archivo `src/App.jsx`
   - Verás el código del componente React

5. **Ejecutar el proyecto**:
   - Haz clic en el panel "Preview" (derecha)
   - Presiona el botón "Ejecutar Proyecto"
   - Espera mientras se instalan las dependencias (primera vez puede tardar)

6. **Verificar**:
   - ✅ El preview debe mostrar la aplicación React
   - ✅ El contador debe funcionar al hacer clic
   - ✅ Los logs deben aparecer en la pestaña "Consola"
   - ✅ Puedes cambiar entre vistas Desktop/Tablet/Mobile

7. **Probar Hot Reload**:
   - Edita el archivo `src/App.jsx`
   - Cambia el texto "¡Has hecho clic" por otro mensaje
   - Guarda el archivo
   - El preview debe actualizarse automáticamente

### Prueba 2: Python API

1. **Copiar archivos** de `test-projects/python-api/` al workspace

2. **Abrir** `main.py` en OpenCode

3. **Ejecutar**:
   - Click en "Ejecutar Proyecto"
   - El sistema detectará FastAPI
   - Instalará las dependencias de `requirements.txt`
   - Iniciará uvicorn en el puerto 8000

4. **Verificar**:
   - ✅ El preview debe mostrar la respuesta JSON del endpoint `/`
   - ✅ Navega a `/docs` para ver Swagger UI
   - ✅ Prueba los endpoints desde Swagger
   - ✅ Los logs deben aparecer en la consola

5. **Probar endpoints**:
```bash
# Desde otra terminal
curl http://localhost:8000/
curl http://localhost:8000/health
curl http://localhost:8000/items
```

### Prueba 3: HTML Estático

1. **Copiar** `test-projects/html-static/index.html` al workspace

2. **Abrir** el archivo en OpenCode

3. **Ver preview**:
   - El preview debe mostrar automáticamente el HTML
   - No necesita "Ejecutar Proyecto" (es estático)

4. **Verificar**:
   - ✅ La página debe renderizarse correctamente
   - ✅ Los botones deben funcionar
   - ✅ Los logs deben aparecer en la consola del navegador
   - ✅ El diseño debe ser responsive

5. **Probar edición en vivo**:
   - Cambia el título en el HTML
   - Guarda
   - El preview debe actualizarse inmediatamente

## 🔍 Verificación del Preview Server

### Health Check

```bash
curl http://localhost:8080/health
```

**Respuesta esperada**:
```json
{
  "status": "ok",
  "runningProcesses": 0,
  "workspace": "/root/workspace"
}
```

### Iniciar un proyecto manualmente

```bash
curl -X POST http://localhost:8080/api/preview/start \
  -H "Content-Type: application/json" \
  -d '{"projectPath": "/root/workspace/react-demo"}'
```

**Respuesta esperada**:
```json
{
  "success": true,
  "type": "react",
  "url": "http://localhost:5173",
  "port": 5173,
  "pid": 12345
}
```

### Ver estado de un proyecto

```bash
curl "http://localhost:8080/api/preview/status?projectPath=/root/workspace/react-demo"
```

### Ver logs

```bash
curl "http://localhost:8080/api/preview/logs?projectPath=/root/workspace/react-demo"
```

## 🎯 Checklist de Funcionalidades

### Funcionalidades Básicas
- [ ] El preview server inicia correctamente
- [ ] OpenCode UI carga en el puerto 3000
- [ ] El panel de preview es visible
- [ ] Los archivos se pueden abrir en el editor

### Detección de Proyectos
- [ ] Detecta proyectos React (package.json con react)
- [ ] Detecta proyectos Python (requirements.txt)
- [ ] Detecta archivos HTML estáticos
- [ ] Muestra el tipo de proyecto detectado

### Instalación de Dependencias
- [ ] Instala npm packages automáticamente
- [ ] Instala pip packages automáticamente
- [ ] Usa cache para node_modules
- [ ] Muestra progreso de instalación

### Ejecución de Proyectos
- [ ] Inicia dev server de React/Vite
- [ ] Inicia servidor FastAPI/uvicorn
- [ ] Sirve archivos HTML estáticos
- [ ] Muestra URL del servidor en ejecución

### Preview UI
- [ ] Muestra el iframe con la aplicación
- [ ] Barra de navegación funciona
- [ ] Botones de navegación (← →) funcionan
- [ ] Botón de refresh funciona
- [ ] Botón de abrir en nueva ventana funciona

### Vistas Responsive
- [ ] Vista Desktop (100% ancho)
- [ ] Vista Tablet (768x1024)
- [ ] Vista Mobile (375x667)
- [ ] Rotación de dispositivo funciona
- [ ] Dimensiones se aplican correctamente

### Consola
- [ ] Pestaña de consola visible
- [ ] Captura logs de console.log
- [ ] Captura errores de console.error
- [ ] Captura warnings de console.warn
- [ ] Muestra logs del servidor

### Hot Reload
- [ ] Cambios en archivos React se reflejan automáticamente
- [ ] Cambios en HTML se reflejan automáticamente
- [ ] No requiere refresh manual
- [ ] Estado de la aplicación se mantiene (cuando es posible)

### Múltiples Lenguajes
- [ ] JavaScript/TypeScript funciona
- [ ] Python funciona
- [ ] HTML/CSS funciona
- [ ] Puede ejecutar múltiples proyectos simultáneamente

## 🐛 Troubleshooting

### Problema: El preview no carga

**Diagnóstico**:
```bash
# Ver logs del contenedor
docker logs opencode-test

# Ver logs del preview server
docker exec opencode-test cat /tmp/preview.log

# Ver logs del dev server
docker exec opencode-test cat /tmp/dev.log
```

**Soluciones**:
1. Verificar que el puerto esté expuesto
2. Verificar que el proceso esté corriendo
3. Reiniciar el contenedor

### Problema: Dependencias no se instalan

**Diagnóstico**:
```bash
# Entrar al contenedor
docker exec -it opencode-test bash

# Verificar espacio en disco
df -h

# Verificar cache
ls -la /root/.cache/projects/
```

**Soluciones**:
1. Limpiar cache: `rm -rf /root/.cache/projects/*`
2. Aumentar memoria del contenedor
3. Instalar manualmente: `cd /root/workspace && npm install`

### Problema: Puerto ocupado

**Diagnóstico**:
```bash
# Ver qué usa el puerto
docker exec opencode-test netstat -tulpn | grep :5173
```

**Soluciones**:
1. Matar el proceso: `kill -9 <PID>`
2. Cambiar el puerto en la configuración
3. Reiniciar el contenedor

## 📊 Métricas de Éxito

Una prueba exitosa debe cumplir:

- ✅ **Tiempo de inicio**: < 30 segundos
- ✅ **Instalación de dependencias**: < 2 minutos (primera vez)
- ✅ **Hot reload**: < 1 segundo
- ✅ **Uso de memoria**: < 2GB por proyecto
- ✅ **Uso de CPU**: < 50% en idle
- ✅ **Tasa de éxito**: > 95% de proyectos detectados correctamente

## 🎓 Casos de Uso Avanzados

### Caso 1: Proyecto Full-Stack

1. Backend Python en `/api`
2. Frontend React en `/client`
3. Ejecutar ambos simultáneamente
4. Verificar comunicación entre ellos

### Caso 2: Múltiples Frameworks

1. Crear 3 proyectos diferentes
2. Ejecutarlos en puertos distintos
3. Cambiar entre ellos en el preview
4. Verificar que todos funcionan

### Caso 3: Proyecto con Base de Datos

1. Proyecto con SQLite
2. Verificar que persiste datos
3. Verificar que el volumen funciona

## 📈 Próximos Pasos

Después de las pruebas básicas:

1. **Optimización**: Medir y mejorar tiempos de carga
2. **Más lenguajes**: Agregar soporte para más frameworks
3. **Debugging**: Integrar debugger en el preview
4. **Tests**: Agregar tests automatizados
5. **Monitoreo**: Agregar métricas y alertas

## 🤝 Reportar Problemas

Si encuentras problemas:

1. **Captura logs**:
```bash
docker logs opencode-test > logs.txt
docker exec opencode-test cat /tmp/preview.log >> logs.txt
docker exec opencode-test cat /tmp/dev.log >> logs.txt
```

2. **Información del sistema**:
```bash
docker info > system-info.txt
docker stats --no-stream >> system-info.txt
```

3. **Crea un issue** con:
   - Descripción del problema
   - Pasos para reproducir
   - Logs adjuntos
   - Información del sistema

---

**¡Buena suerte con las pruebas! 🚀**

Si todo funciona correctamente, tendrás un previsualizador profesional completamente funcional que puede ejecutar aplicaciones de múltiples lenguajes en la nube sin las limitaciones de una terminal tradicional.
