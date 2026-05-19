# 🚀 Configuración del Previsualizador en Easypanel

## 📋 Guía Paso a Paso

### 1. Preparar la Imagen Docker

```bash
# Construir la imagen localmente
docker build -t opencode-evolved:latest .

# O subirla a Docker Hub
docker tag opencode-evolved:latest tu-usuario/opencode-evolved:latest
docker push tu-usuario/opencode-evolved:latest
```

### 2. Crear Aplicación en Easypanel

1. **Accede a tu panel de Easypanel**
2. **Crea un nuevo proyecto** o selecciona uno existente
3. **Agrega una nueva aplicación**
4. **Selecciona "Docker Image"**

### 3. Configuración de la Aplicación

#### Información Básica
```
Nombre: opencode-evolved
Imagen: tu-usuario/opencode-evolved:latest
```

#### Puertos a Exponer

| Puerto Interno | Puerto Externo | Descripción | Dominio |
|----------------|----------------|-------------|---------|
| 3000 | 80 o 443 | OpenCode UI (Principal) | opencode.tudominio.com |
| 8080 | 8080 | Preview Server API | preview.tudominio.com |
| 5173 | 5173 | Vite Dev Server | dev.tudominio.com |
| 4200 | 4200 | Angular Dev | angular.tudominio.com |
| 8000 | 8000 | Python/FastAPI | api.tudominio.com |

**Configuración recomendada en Easypanel:**

```yaml
ports:
  - containerPort: 3000
    protocol: TCP
    public: true
    domain: opencode.tudominio.com
    
  - containerPort: 8080
    protocol: TCP
    public: true
    domain: preview.tudominio.com
    
  - containerPort: 5173
    protocol: TCP
    public: false  # Solo acceso interno
```

### 4. Variables de Entorno

#### Variables Requeridas (al menos una API key)

```env
# Anthropic (Recomendado)
ANTHROPIC_API_KEY=sk-ant-api03-xxxxx

# O OpenAI
OPENAI_API_KEY=sk-xxxxx

# O Google
GOOGLE_API_KEY=xxxxx

# O OpenCode
OPENCODE_API_KEY=xxxxx
```

#### Variables Opcionales

```env
# Git Repository
GIT_REPO_URL=https://github.com/usuario/repo.git
GIT_BRANCH=main
GIT_USER_NAME=OpenCode Bot
GIT_USER_EMAIL=bot@opencode.local

# OpenClaw (Agente autónomo)
OPENCLAW_GATEWAY_TOKEN=tu-token-secreto-aqui
OPENCLAW_MODEL=anthropic/claude-sonnet-4-5

# Telegram (opcional para OpenClaw)
TELEGRAM_BOT_TOKEN=xxxxx:yyyyy

# Configuración de recursos
NODE_OPTIONS=--max-old-space-size=2048
```

### 5. Volúmenes Persistentes

**Crear los siguientes volúmenes en Easypanel:**

| Nombre | Punto de Montaje | Tamaño | Descripción |
|--------|------------------|--------|-------------|
| opencode-config | /root/.local/share/opencode | 1 GB | Configuración y auth |
| workspace | /root/workspace | 10 GB | Código del proyecto |
| projects | /root/projects | 5 GB | Proyectos guardados |
| cache | /root/.cache/projects | 20 GB | Cache de dependencias |

**Configuración en Easypanel:**

```yaml
volumes:
  - name: opencode-config
    mountPath: /root/.local/share/opencode
    size: 1Gi
    
  - name: workspace
    mountPath: /root/workspace
    size: 10Gi
    
  - name: projects
    mountPath: /root/projects
    size: 5Gi
    
  - name: cache
    mountPath: /root/.cache/projects
    size: 20Gi
```

### 6. Recursos Recomendados

#### Configuración Mínima
```yaml
resources:
  requests:
    memory: "2Gi"
    cpu: "1000m"
  limits:
    memory: "4Gi"
    cpu: "2000m"
```

#### Configuración Recomendada (Producción)
```yaml
resources:
  requests:
    memory: "4Gi"
    cpu: "2000m"
  limits:
    memory: "8Gi"
    cpu: "4000m"
```

#### Configuración Alta Performance
```yaml
resources:
  requests:
    memory: "8Gi"
    cpu: "4000m"
  limits:
    memory: "16Gi"
    cpu: "8000m"
```

### 7. Health Checks

```yaml
healthCheck:
  httpGet:
    path: /health
    port: 8080
  initialDelaySeconds: 30
  periodSeconds: 10
  timeoutSeconds: 5
  failureThreshold: 3
```

### 8. Configuración de Red

#### Habilitar CORS (si es necesario)

Si necesitas acceder desde otros dominios, agrega estas variables:

```env
CORS_ORIGIN=https://tuapp.com,https://otraapp.com
CORS_CREDENTIALS=true
```

#### Configurar Proxy Inverso

Si usas un proxy inverso (Nginx, Traefik), configura:

```nginx
# Nginx config
location / {
    proxy_pass http://opencode:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}

location /preview/ {
    proxy_pass http://opencode:8080/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
}

location /dev/ {
    proxy_pass http://opencode:5173/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
}
```

### 9. SSL/TLS (HTTPS)

Easypanel maneja automáticamente SSL con Let's Encrypt. Solo necesitas:

1. **Configurar tu dominio** en la sección de dominios
2. **Habilitar SSL** en la configuración del puerto
3. **Esperar** a que se genere el certificado (1-2 minutos)

### 10. Despliegue

#### Opción A: Desde Docker Hub

```yaml
image: tu-usuario/opencode-evolved:latest
imagePullPolicy: Always
```

#### Opción B: Desde GitHub (con CI/CD)

1. Conecta tu repositorio de GitHub
2. Configura el Dockerfile path: `./dockerfile`
3. Habilita auto-deploy en push a main

#### Opción C: Build en Easypanel

```yaml
build:
  context: .
  dockerfile: dockerfile
```

### 11. Verificación Post-Despliegue

Una vez desplegado, verifica:

```bash
# 1. Health check del preview server
curl https://preview.tudominio.com/health

# Respuesta esperada:
# {"status":"ok","runningProcesses":0,"workspace":"/root/workspace"}

# 2. Verificar OpenCode UI
curl https://opencode.tudominio.com

# 3. Probar inicio de proyecto
curl -X POST https://preview.tudominio.com/api/preview/start \
  -H "Content-Type: application/json" \
  -d '{"projectPath": "/root/workspace"}'
```

### 12. Monitoreo y Logs

#### Ver logs en tiempo real

En Easypanel:
1. Ve a tu aplicación
2. Click en "Logs"
3. Selecciona el contenedor

#### Logs específicos dentro del contenedor

```bash
# Acceder al contenedor
docker exec -it <container-id> bash

# Ver logs del preview server
tail -f /tmp/preview.log

# Ver logs del dev server
tail -f /tmp/dev.log

# Ver logs de OpenClaw (si está habilitado)
tail -f /tmp/openclaw.log
```

### 13. Backup y Restauración

#### Backup de volúmenes

```bash
# Backup del workspace
docker run --rm -v opencode_workspace:/data -v $(pwd):/backup \
  alpine tar czf /backup/workspace-backup.tar.gz -C /data .

# Backup de la configuración
docker run --rm -v opencode_config:/data -v $(pwd):/backup \
  alpine tar czf /backup/config-backup.tar.gz -C /data .
```

#### Restauración

```bash
# Restaurar workspace
docker run --rm -v opencode_workspace:/data -v $(pwd):/backup \
  alpine tar xzf /backup/workspace-backup.tar.gz -C /data

# Restaurar configuración
docker run --rm -v opencode_config:/data -v $(pwd):/backup \
  alpine tar xzf /backup/config-backup.tar.gz -C /data
```

### 14. Actualización

#### Actualizar a nueva versión

```bash
# 1. Pull nueva imagen
docker pull tu-usuario/opencode-evolved:latest

# 2. En Easypanel, click en "Redeploy"
# O usa la API:
curl -X POST https://api.easypanel.io/projects/{project}/services/{service}/redeploy \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 15. Troubleshooting

#### Problema: El preview no carga

**Solución:**
```bash
# 1. Verificar que el preview server esté corriendo
curl http://localhost:8080/health

# 2. Verificar logs
docker logs <container-id> | grep preview

# 3. Reiniciar el contenedor
docker restart <container-id>
```

#### Problema: Dependencias no se instalan

**Solución:**
```bash
# 1. Limpiar cache
rm -rf /root/.cache/projects/*

# 2. Verificar espacio en disco
df -h

# 3. Aumentar memoria si es necesario
# En Easypanel: Settings > Resources > Memory: 4Gi → 8Gi
```

#### Problema: Puerto ocupado

**Solución:**
```bash
# 1. Ver qué proceso usa el puerto
netstat -tulpn | grep :5173

# 2. Matar el proceso
kill -9 <PID>

# 3. O cambiar el puerto en variables de entorno
PORT=5174 npm run dev
```

### 16. Seguridad

#### Recomendaciones

1. **Usa HTTPS** siempre (Easypanel lo hace automático)
2. **Protege las API keys** con variables de entorno
3. **Limita acceso** a puertos internos (5173, 8000, etc.)
4. **Habilita autenticación** si es público
5. **Actualiza regularmente** la imagen Docker

#### Configurar autenticación básica

```nginx
# En tu proxy inverso
location / {
    auth_basic "OpenCode Access";
    auth_basic_user_file /etc/nginx/.htpasswd;
    proxy_pass http://opencode:3000;
}
```

### 17. Optimización de Performance

#### Cache de dependencias

El sistema ya usa cache inteligente, pero puedes optimizar:

```env
# Aumentar memoria para npm
NODE_OPTIONS=--max-old-space-size=4096

# Usar npm ci en lugar de npm install (más rápido)
NPM_CONFIG_PREFER_OFFLINE=true
```

#### Precargar proyectos comunes

```bash
# Dentro del contenedor
cd /root/.cache/projects

# Precachear React
mkdir react-template && cd react-template
npm init -y
npm install react react-dom vite @vitejs/plugin-react

# Precachear Vue
mkdir vue-template && cd vue-template
npm init -y
npm install vue vite @vitejs/plugin-vue
```

### 18. Integración con CI/CD

#### GitHub Actions

```yaml
name: Deploy to Easypanel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build and push Docker image
        run: |
          docker build -t ${{ secrets.DOCKER_USERNAME }}/opencode-evolved:latest .
          echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
          docker push ${{ secrets.DOCKER_USERNAME }}/opencode-evolved:latest
      
      - name: Deploy to Easypanel
        run: |
          curl -X POST https://api.easypanel.io/projects/${{ secrets.PROJECT_ID }}/services/${{ secrets.SERVICE_ID }}/redeploy \
            -H "Authorization: Bearer ${{ secrets.EASYPANEL_TOKEN }}"
```

---

## 🎉 ¡Listo!

Tu previsualizador profesional de OpenCode está ahora corriendo en Easypanel con soporte para:

- ✅ React, Vue, Angular, Svelte
- ✅ Node.js, Python, Go, Rust, PHP, Ruby
- ✅ HTML/CSS/JS estáticos
- ✅ Hot-reload automático
- ✅ Múltiples proyectos simultáneos
- ✅ Cache inteligente de dependencias
- ✅ Consola integrada
- ✅ Vistas responsive (mobile, tablet, desktop)

**Accede a tu instancia en:** `https://opencode.tudominio.com`

**¿Necesitas ayuda?** Consulta la documentación completa en `PREVISUALIZADOR-PROFESIONAL.md`
