# Despliegue de OpenCode OS Evolution

Este proyecto ha sido evolucionado para ser una interfaz autónoma y robusta. Aquí tienes cómo desplegarlo en cualquier entorno.

## Requisitos
- **Docker** y **Docker Compose** (Recomendado para aislamiento).
- **Node.js 20+** y **pnpm** (Para ejecución local).
- **Ollama** (Opcional, para modelos locales gratuitos).

## 1. Despliegue con Docker (El más fácil)
Ideal para servidores VPS o NAS.

```bash
# Sincronizar el repositorio
git clone <tu-repositorio-opencode>
cd opencode-evolution

# Lanzar los servicios
docker compose up -d
```
El sistema estará disponible en el puerto `3000`.

## 2. Ejecución Local (Desarrollo)
```bash
# Instalar dependencias
pnpm install

# Iniciar servidor y frontend
pnpm run dev
```

## Características Evolucionadas
- **Tablero Bento**: Gestiona proyectos visualmente.
- **Vista Previa**: Navegador interno para tus apps.
- **Memoria DB**: El sistema recuerda tus proyectos y estado.
- **Cualquier Lenguaje**: Soporte total para Python, JS, Go, Rust y más.
