# OpenCode OS Evolution 🚀

Bienvenidos a **OpenCode OS Evolution**, un Sistema Operativo de Desarrollo Integrado (IDE) y agente de inteligencia artificial (AI) de nueva generación, construido orgánicamente para ofrecer la experiencia de codificación más fluida, autónoma y capaz.

Este proyecto fue evolucionado sobre la base nativa del potente asistente de terminal `opencode-ai`, proveyéndole una interfaz gráfica de última generación y un backend personalizado.

## 🌟 Características Principales

- **Interfaz "Glassmorphism" Premium:** Un espacio de trabajo unificado con temas oscuros de alta gama, paneles colapsables y ventanas de previsualización sin abandonar el navegador. 
- **Integración Autónoma con Modelos IA:** Utiliza **todos los modelos** de manera nativa (Claude, Gemini, OpenAI, Qwen, Nemotron, Llama) consumiendo los proveedores que prefieras (Groq, OpenRouter, Cerebras, TogetherAI) a través del archivo dinámico `.config/opencode/opencode.json`.
- **Chat de IA en Tiempo Real:** El `api-server` está integrado con el **Vercel AI SDK**, permitiendo la transmisión (streaming) de las respuestas desde las mejores mentes de IA directamente a tu panel de ChatPanel.
- **Sistema de Seguridad Integral:** Cuenta con inicio de sesión y registro protegido para asegurar que tus workspaces se administren correctamente ('Route Guard' implementado en React).
- **Control Total del Sistema (MCP):** Capacidad nativa de gestionar tareas en segundo plano usando `PM2`, clonar, hacer push a repositorios de Github, y ejecutar scripts Python y TypeScript.
- **Catálogo de APIs Integrado:** Acceso a `public-apis` para desarrollo rápido y gratuito. 

## 🏗️ Arquitectura del Sistema (pnpm workspace)

Este monorepo se encuentra dividido en espacios de trabajo independientes pero totalmente interconectados:

- `artifacts/opencode-ui/` - *(Frontend)*: Interfaz construida en React + Vite + Wouter con TailwindCSS y Radix UI.
- `artifacts/api-server/` - *(Backend)*: Servidor API robusto montado en Express 5, que procesa las conexiones a la Base de Datos (PostgreSQL via Drizzle) y enruta el Chat hacia las APIs LLM.
- `lib/api-spec/` - Especificación OpenAPI para la API con generación automática de validaciones de Zod.
- `lib/api-client-react/` - Hooks generados automáticamente con React Query para llamadas frontend 100% tipadas.
- `lib/db/` - La capa de persistencia de datos y manipulación.

## 📦 Instalación

1. Es necesario contar con `Node.js 20+`, `pnpm` y asegurarse de instalar el CLI global nativo para las características de terminal:
```bash
npm install -g opencode-ai
```

2. Clona el proyecto y ve a la carpeta raíz.

3. Instala las dependencias del monorepo:
```bash
pnpm install
```

4. Prepara la configuración copiando `.env.example` a `.env` y agregando los API Keys que vayas a requerir:
```bash
cp .env.example .env
```
*(Es aquí donde colocas las llaves para tus proveedores elegidos: Groq, OpenRouter, etc.)*

## 🟢 ¿Cómo ejecutarlo?

Para desarrollo, en la raíz del proyecto, ejecuta:
```bash
pnpm run dev
```

Esto iniciará el **api-server** y el cliente web (`opencode-ui`) para procesar Hot-Reload y estar a la escucha en el puerto `3000`.

## 🤖 Uso de Modelos Nativos

Puedes configurar dinámicamente cualquier modelo que vayas a usar, editando el archivo de configuración `.config/opencode/opencode.json`. El frontend levantará y ofrecerá exactamente la lista que indiques ahí y el sistema sabrá cómo llamar a ese LLM.

La estructura la maneja automáticamente el _Router_ en `api-server/src/routes/models.ts` y las respuestas interactúan en tiempo de ejecución en `chat.ts`.

---
*OpenCode OS Evolution - Deja que la Inteligencia Artificial eleve tu código al siguiente nivel.*
