FROM node:22-bookworm-slim AS base

# ============================================
# HERRAMIENTAS DE SISTEMA - Base
# ============================================
RUN apt-get update && apt-get install -y \
    python3 python3-pip python3-venv \
    golang-go \
    git curl wget unzip zip tar \
    nginx \
    postgresql-client \
    sudo \
    && rm -rf /var/lib/apt/lists/*

# ============================================
# HERRAMIENTAS DE CONTROL REMOTO
# ============================================
RUN apt-get update && apt-get install -y \
    # VNC - Control remoto grafico
    xvfb x11vnc tigervnc-standalone-server tigervnc-viewer \
    # RDP - Escritorio remoto Windows
    freerdp2-x11 freerdp2-shadow-x11 \
    # SSH - Shell remoto
    openssh-client sshpass \
    # Window Manager liviano
    fluxbox \
    # Audio
    pulseaudio-utils \
    # Wake-on-LAN
    etherwake \
    net-tools iputils-ping dnsutils \
    # nmap para descubrimiento de red
    nmap \
    && rm -rf /var/lib/apt/lists/*

# ============================================
# HERRAMIENTAS DE VISION Y CAPTURA
# ============================================
RUN apt-get update && apt-get install -y \
    # Screenshots y grabacion
    scrot \
    ffmpeg \
    imagemagick \
    # OCR - Reconocimiento de texto en pantalla
    tesseract-ocr tesseract-ocr-spa tesseract-ocr-eng \
    # Procesamiento de imagenes
    libgl1-mesa-glx libglib2.0-0 \
    # X11 tools
    xdotool x11-utils x11-xserver-utils \
    # Webcam
    v4l-utils \
    && rm -rf /var/lib/apt/lists/*

# ============================================
# HERRAMIENTAS DE AUTOMATIZACION (Python)
# ============================================
RUN pip3 install --break-system-packages --no-cache-dir \
    opencv-python \
    opencv-contrib-python \
    pytesseract \
    pyautogui \
    selenium \
    pillow \
    numpy \
    mss \
    pygetwindow \
    pyperclip \
    keyboard \
    mouse \
    vncdotool \
    requests \
    psutil \
    python-nmap \
    python-wakeonlan \
    docker \
    paramiko \
    asyncssh \
    pywinrm \
    impacket \
    pypsexec \
    python-pptx \
    openpyxl \
    beautifulsoup4 \
    lxml \
    rich \
    colorama \
    websockets \
    flask \
    aiohttp

# ============================================
# HERRAMIENTAS DE AUTOMATIZACION (Node.js / Navegador)
# ============================================
RUN npm install -g \
    playwright \
    puppeteer \
    puppeteer-core \
    lighthouse \
    nodemon \
    forever \
    --force

# Instalar Chromium para Playwright
RUN npx playwright install chromium && \
    npx playwright install firefox && \
    npx playwright install-deps chromium

# ============================================
# INSTALACION OPENCODE
# ============================================
RUN npm install -g opencode-ai --force

# Directorios del sistema
RUN mkdir -p /workspace /data /etc/opencode /opt/installer /var/log/opencode \
    /tmp/.X11-unix /tmp/.XIM-unix /opt/scripts /opt/www

# Variables de entorno para display virtual
ENV HOME=/root \
    DISPLAY=:99 \
    XDG_RUNTIME_DIR=/tmp/runtime-root \
    PLAYWRIGHT_BROWSERS_PATH=/root/.cache/ms-playwright

# Configuracion OpenCode
RUN mkdir -p /root/.config/opencode
COPY opencode.json /root/.config/opencode/opencode.json

# Scripts SaaS
COPY scripts/entrypoint.sh /entrypoint.sh
COPY scripts/users.conf /etc/opencode/users.conf
RUN chmod +x /entrypoint.sh

# Instrucciones del sistema (OpenCode las carga automaticamente)
COPY .opencode/ /workspace/.opencode/

# Scripts de control remoto
COPY scripts/ /opt/scripts/
RUN chmod +x /opt/scripts/*.sh 2>/dev/null || true

# Landing page
COPY www/ /opt/www/

# Nginx reverse proxy
COPY nginx-saas.conf /etc/nginx/sites-available/opencode
RUN ln -sf /etc/nginx/sites-available/opencode /etc/nginx/sites-enabled/ && \
    rm -f /etc/nginx/sites-enabled/default

# Instalador Windows
COPY dist/OpenCode-Evolution-Setup.exe /opt/installer/OpenCode-Evolution-Setup.exe

# Puertos
EXPOSE 80 3000 3001 3002 3003 3004 3005 \
    5900 5901 5902 5903 5904 5905 \
    3389 8080 9222

WORKDIR /workspace

# Entrypoint
CMD ["/bin/bash", "/entrypoint.sh"]