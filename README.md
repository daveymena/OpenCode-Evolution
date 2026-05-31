# 🌌 OpenCode Deploy

Configuración limpia y nativa de **OpenCode** para desarrollo local y despliegue rápido en **Easypanel** o servidores basados en Docker.

---

## 🚀 Despliegue en Easypanel

OpenCode oficial corre como una interfaz web ligera y persistente:

1. **Crear una App en Easypanel:**
   - Selecciona **Docker Image** o conecta este repositorio de Git.
   - Apunta al archivo `./dockerfile` para la compilación.

2. **Puertos:**
   - Expón el puerto contenedor `3000` al puerto externo de tu preferencia (ej. `80` o `443`).

3. **Volúmenes Persistentes:**
   - Monta un volumen para persistir proyectos e historiales de conversación:
     - **Nombre:** `opencode-data`
     - **Punto de montaje:** `/root/.local/share/opencode`

4. **Variables de Entorno:**
   - Configura las claves de IA necesarias para el agente:
     ```env
     ANTHROPIC_API_KEY=tu_sk_key
     OPENAI_API_KEY=tu_sk_key
     ```

---

## 💻 Ejecución Local con Docker

Puedes levantar la instancia localmente con Docker Compose de manera inmediata:

```bash
docker-compose up -d --build
```

Esto compilará y levantará OpenCode expuesto en `http://localhost:3000` usando almacenamiento de volumen persistente.
