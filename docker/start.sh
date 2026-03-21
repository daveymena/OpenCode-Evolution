#!/bin/bash
# ============================================================
# OpenCode - Script de inicio para Docker/EasyPanel
# ============================================================
set -e

echo "🚀 Iniciando OpenCode..."
echo "   Versión: $(opencode --version 2>/dev/null || echo 'desconocida')"
echo "   Puerto: ${PORT:-3000}"

# ---- Cargar .env si existe ---- #
if [ -f "/workspace/.env" ]; then
  echo "   Cargando .env..."
  set -o allexport
  source /workspace/.env
  set +o allexport
fi

# ---- Configurar proveedores ---- #

# Anthropic Claude
if [ -n "$ANTHROPIC_API_KEY" ]; then
  echo "   ✅ Anthropic Claude: configurado"
fi

# OpenAI
if [ -n "$OPENAI_API_KEY" ]; then
  echo "   ✅ OpenAI GPT: configurado"
fi

# Google Gemini
if [ -n "$GOOGLE_GENERATIVE_AI_API_KEY" ]; then
  echo "   ✅ Google Gemini: configurado"
fi

# Groq (GRATIS)
if [ -n "$GROQ_API_KEY" ]; then
  echo "   ✅ Groq (gratis): configurado - Llama 70B, Gemma 9B, Mixtral, DeepSeek R1, Qwen QwQ"
fi

# OpenRouter (GRATIS para modelos :free)
if [ -n "$OPENROUTER_API_KEY" ]; then
  echo "   ✅ OpenRouter (27+ modelos gratis): configurado"
fi

# Cerebras (GRATIS)
if [ -n "$CEREBRAS_API_KEY" ]; then
  echo "   ✅ Cerebras (gratis, ultrarrápido): configurado"
fi

# Together AI
if [ -n "$TOGETHER_AI_API_KEY" ]; then
  echo "   ✅ Together AI: configurado"
fi

# Mistral
if [ -n "$MISTRAL_API_KEY" ]; then
  echo "   ✅ Mistral AI: configurado"
fi

# xAI Grok
if [ -n "$XAI_API_KEY" ]; then
  echo "   ✅ xAI Grok: configurado"
fi

# Ollama (modelos locales)
if [ -n "$OLLAMA_HOST" ]; then
  export OLLAMA_BASE_URL="$OLLAMA_HOST"
  echo "   ✅ Ollama (local, gratis): configurado en $OLLAMA_HOST"
elif curl -s --connect-timeout 2 http://ollama:11434 >/dev/null 2>&1; then
  export OLLAMA_BASE_URL="http://ollama:11434"
  echo "   ✅ Ollama (local, gratis): detectado automáticamente"
fi

# ---- Crear estructura de directorios ---- #
mkdir -p "${OPENCODE_WORKSPACE:-/workspace}/proyectos"

echo ""
echo "🌐 OpenCode disponible en http://0.0.0.0:${PORT:-3000}"
echo "============================================================"

# ---- Iniciar OpenCode ---- #
exec opencode serve \
  --port "${PORT:-3000}" \
  --hostname 0.0.0.0
