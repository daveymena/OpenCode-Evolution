#!/bin/bash
# ============================================================
# OpenCode - Script de inicio completo
# Soporta: Anthropic, OpenAI, Google, Groq, OpenRouter,
#          Together AI, Mistral, xAI, Cerebras, Perplexity
#          + Modelos locales via Ollama
# ============================================================

# ---------- REPLIT (cuando corre en Replit) ----------
if [ -n "$AI_INTEGRATIONS_ANTHROPIC_API_KEY" ]; then
  export ANTHROPIC_API_KEY="$AI_INTEGRATIONS_ANTHROPIC_API_KEY"
  export ANTHROPIC_BASE_URL="$AI_INTEGRATIONS_ANTHROPIC_BASE_URL"
fi
if [ -n "$AI_INTEGRATIONS_OPENAI_API_KEY" ]; then
  export OPENAI_API_KEY="$AI_INTEGRATIONS_OPENAI_API_KEY"
  export OPENAI_BASE_URL="$AI_INTEGRATIONS_OPENAI_BASE_URL"
fi
if [ -n "$AI_INTEGRATIONS_GEMINI_API_KEY" ]; then
  export GOOGLE_GENERATIVE_AI_API_KEY="$AI_INTEGRATIONS_GEMINI_API_KEY"
fi

# ---------- GRATUITOS (requieren solo registro gratis) ----------
# Groq  → https://console.groq.com (gratuito, muy rápido)
# GROQ_API_KEY ya debe estar en .env o env del sistema

# OpenRouter → https://openrouter.ai (27+ modelos gratuitos con :free)
# OPENROUTER_API_KEY ya debe estar en .env o env del sistema

# Together AI → https://api.together.xyz (créditos gratis al registrarse)
# TOGETHER_AI_API_KEY ya debe estar en .env o env del sistema

# Cerebras → https://cloud.cerebras.ai (gratuito)
# CEREBRAS_API_KEY ya debe estar en .env o env del sistema

# ---------- DE PAGO OPCIONALES ----------
# MISTRAL_API_KEY, XAI_API_KEY, PERPLEXITY_API_KEY, COHERE_API_KEY

# ---------- LOCAL (cuando Ollama está disponible) ----------
if [ -n "$OLLAMA_HOST" ]; then
  export OLLAMA_BASE_URL="${OLLAMA_HOST}"
elif curl -s --connect-timeout 1 http://ollama:11434 >/dev/null 2>&1; then
  export OLLAMA_BASE_URL="http://ollama:11434"
elif curl -s --connect-timeout 1 http://localhost:11434 >/dev/null 2>&1; then
  export OLLAMA_BASE_URL="http://localhost:11434"
fi

# ---------- Directorio de trabajo ----------
WORKSPACE="${OPENCODE_WORKSPACE:-/workspace}"
mkdir -p "$WORKSPACE/proyectos"

# ---------- Iniciar OpenCode ----------
exec /usr/local/bin/opencode serve \
  --port "${PORT:-3000}" \
  --hostname 0.0.0.0
