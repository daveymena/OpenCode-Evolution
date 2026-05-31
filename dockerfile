FROM node:22-bookworm-slim AS base

# Dependencias del Sistema para que OpenCode pueda compilar y ejecutar de todo
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    golang-go \
    git \
    curl \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Instalación NATIVA de OpenCode
RUN npm install -g opencode-ai --force

# Crear carpeta de trabajo para los proyectos del usuario
RUN mkdir -p /workspace

# Variables de entorno
ENV HOME=/root

# Configuración del Gateway Kilo (Modelos Free)
RUN mkdir -p /root/.config/opencode
COPY opencode.json /root/.config/opencode/opencode.json

# Puerto estándar para EasyPanel
EXPOSE 3000

# Iniciar OpenCode apuntando al workspace como directorio de trabajo
WORKDIR /workspace
CMD ["opencode", "web", "--hostname", "0.0.0.0", "--port", "3000"]