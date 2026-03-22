# ============================================================
# OpenCode - Imagen Docker completa
# Soporta: Node.js, Python, Go, Rust, Java, Ruby, PHP,
#          .NET, Deno, Bun, C/C++, Bash y más
# Para EasyPanel / Docker / Servidor local
# ============================================================

FROM ubuntu:24.04

# Evitar prompts interactivos durante la instalación
ENV DEBIAN_FRONTEND=noninteractive
ENV TZ=UTC

# ---- Herramientas base ---- #
RUN apt-get update && apt-get install -y \
    # Herramientas esenciales
    curl wget git unzip zip tar gzip \
    build-essential gcc g++ make cmake \
    # Para SSL/TLS
    ca-certificates gnupg \
    # Útiles
    jq tree htop nano vim less \
    # Para lenguajes
    libssl-dev libffi-dev zlib1g-dev \
    pkg-config libbz2-dev libreadline-dev \
    libsqlite3-dev libncurses5-dev \
    # Para Java
    fontconfig \
    && rm -rf /var/lib/apt/lists/*

# ============================================================
# NODE.JS 22 (LTS)
# ============================================================
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g npm@latest \
    && npm install -g pnpm yarn \
    && rm -rf /var/lib/apt/lists/*

# ============================================================
# BUN (Runtime JS/TS ultrarrápido - requerido por OpenCode)
# ============================================================
RUN curl -fsSL https://bun.sh/install | bash \
    && cp /root/.bun/bin/bun /usr/local/bin/bun \
    && ln -sf /usr/local/bin/bun /usr/local/bin/bunx

# ============================================================
# PYTHON 3.12 + pip + uv + poetry
# ============================================================
RUN apt-get update && apt-get install -y \
    python3.12 python3.12-dev python3.12-venv python3-pip \
    && update-alternatives --install /usr/bin/python python /usr/bin/python3.12 1 \
    && update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.12 1 \
    && pip3 install --no-cache-dir --break-system-packages \
        uv poetry \
        # --- Trading & Finanzas ---
        ccxt pandas numpy scipy \
        pandas-ta backtrader \
        python-binance pybit alpaca-trade-api \
        yfinance alpha_vantage \
        # --- Comunicación ---
        python-telegram-bot \
        twilio sendgrid \
        # --- Google Ecosystem ---
        google-api-python-client google-auth-httplib2 google-auth-oauthlib \
        gspread pygsheets \
        # --- E-commerce ---
        woocommerce shopifyapi \
        # --- Bases de Datos ---
        psycopg2-binary redis motor pymongo \
        sqlalchemy alembic \
        # --- Automatización y Datos ---
        requests httpx aiohttp \
        python-dotenv schedule apscheduler \
        beautifulsoup4 lxml \
        playwright selenium \
        scrapy \
        # --- Pagos (Colombia) ---
        mercadopago paypal-checkout-serversdk \
        # --- IA / LLM ---
        openai anthropic groq \
        langchain langchain-community \
        transformers torch --extra-index-url https://download.pytorch.org/whl/cpu \
        # --- Utilidades Dev ---
        black flake8 pytest fastapi uvicorn \
        pydantic rich typer \
    && rm -rf /var/lib/apt/lists/*

# ============================================================
# GO 1.23
# ============================================================
RUN curl -fsSL https://go.dev/dl/go1.23.4.linux-amd64.tar.gz -o /tmp/go.tar.gz \
    && tar -C /usr/local -xzf /tmp/go.tar.gz \
    && rm /tmp/go.tar.gz
ENV PATH="/usr/local/go/bin:${PATH}"
ENV GOPATH="/root/go"
ENV PATH="${GOPATH}/bin:${PATH}"

# ============================================================
# RUST + CARGO (via rustup)
# ============================================================
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | \
    sh -s -- -y --no-modify-path --profile minimal
ENV PATH="/root/.cargo/bin:${PATH}"

# ============================================================
# JAVA 21 (JDK) + Maven + Gradle
# ============================================================
RUN apt-get update && apt-get install -y \
    openjdk-21-jdk maven \
    && rm -rf /var/lib/apt/lists/*
ENV JAVA_HOME="/usr/lib/jvm/java-21-openjdk-amd64"
ENV PATH="${JAVA_HOME}/bin:${PATH}"

# Gradle
RUN curl -fsSL https://services.gradle.org/distributions/gradle-8.11.1-bin.zip -o /tmp/gradle.zip \
    && unzip -d /opt /tmp/gradle.zip \
    && mv /opt/gradle-8.11.1 /opt/gradle \
    && rm /tmp/gradle.zip
ENV PATH="/opt/gradle/bin:${PATH}"

# ============================================================
# RUBY 3.3
# ============================================================
# ============================================================
# PM2 - Process Manager para bots 24/7
# ============================================================
RUN npm install -g pm2

# ============================================================
# RUBY 3.3
# ============================================================
RUN apt-get update && apt-get install -y \
    ruby ruby-dev ruby-bundler \
    && gem install rails --no-document \
    && rm -rf /var/lib/apt/lists/*

# ============================================================
# PHP 8.3 + Composer
# ============================================================
RUN apt-get update && apt-get install -y \
    php8.3 php8.3-cli php8.3-common \
    php8.3-curl php8.3-mbstring php8.3-xml \
    php8.3-zip php8.3-pgsql php8.3-mysql \
    && rm -rf /var/lib/apt/lists/*
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# ============================================================
# .NET 8 SDK
# ============================================================
RUN curl -fsSL https://packages.microsoft.com/config/ubuntu/24.04/packages-microsoft-prod.deb -o /tmp/packages-microsoft-prod.deb \
    && dpkg -i /tmp/packages-microsoft-prod.deb \
    && rm /tmp/packages-microsoft-prod.deb \
    && apt-get update \
    && apt-get install -y dotnet-sdk-8.0 \
    && rm -rf /var/lib/apt/lists/*

# ============================================================
# DENO
# ============================================================
RUN curl -fsSL https://deno.land/install.sh | sh \
    && cp /root/.deno/bin/deno /usr/local/bin/deno

# ============================================================
# HERRAMIENTAS NODE.JS GLOBALES (MCP & Automatización)
# ============================================================
RUN npm install -g \
    # Bots & APIs
    wrangler \
    # Playwright para automatización web
    @playwright/test \
    # Monitoreo
    clinic \
    # Utilidades
    nodemon tsx ts-node \
    dotenv-cli \
    opencode-ai

# Instalar browsers de Playwright
RUN playwright install chromium --with-deps 2>/dev/null || true

# ============================================================
# OPENCODE EVOLUTION - Configuración Final
# ============================================================
WORKDIR /app

# Copiar todo el workspace
COPY . .

# Instalar dependencias con PNPM
RUN npm install -g pnpm && pnpm install --no-frozen-lockfile

# Construir la base de datos (schema)
RUN pnpm --filter @workspace/db run push || true

# Construir el servidor API
RUN pnpm --filter @workspace/api-server run build

# Variables necesarias para el build de Vite
ENV PORT=3000
ENV BASE_PATH=/

# NOTA: En Docker (Linux), el UI se puede construir sin problemas de Rollup
RUN pnpm --filter @workspace/opencode-ui run build

# Configuración del Entorno de Ejecución
EXPOSE 3000
ENV PORT=3000
ENV NODE_ENV=production

# Comando para iniciar el servidor evolucionado
CMD ["pnpm", "--filter", "@workspace/api-server", "run", "start"]
