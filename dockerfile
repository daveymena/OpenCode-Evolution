FROM node:22-bookworm-slim AS base

# Dependencias del Sistema
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    golang-go \
    git \
    curl \
    wget \
    nginx \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Instalacion NATIVA de OpenCode
RUN npm install -g opencode-ai --force

# Directorios del sistema
RUN mkdir -p /workspace /data /etc/opencode /opt/installer /var/log/opencode

# Variables de entorno
ENV HOME=/root

# Configuracion del Gateway Kilo (Modelos Free)
RUN mkdir -p /root/.config/opencode
COPY opencode.json /root/.config/opencode/opencode.json

# Scripts SaaS
COPY scripts/entrypoint.sh /entrypoint.sh
COPY scripts/users.conf /etc/opencode/users.conf
RUN chmod +x /entrypoint.sh

# Nginx reverse proxy
COPY nginx-saas.conf /etc/nginx/sites-available/opencode
RUN ln -sf /etc/nginx/sites-available/opencode /etc/nginx/sites-enabled/ && \
    rm -f /etc/nginx/sites-enabled/default

# Instalador Windows para descarga via web
COPY dist/OpenCode-Evolution-Setup.exe /opt/installer/OpenCode-Evolution-Setup.exe

# Puertos
EXPOSE 80 3000 3001 3002 3003 3004 3005

WORKDIR /workspace

# Entrypoint: inicia Nginx + instancias OpenCode multi-usuario
CMD ["/bin/bash", "/entrypoint.sh"]