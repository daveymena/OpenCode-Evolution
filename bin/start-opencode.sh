#!/bin/bash
# Script de inicio de OpenCode con todos los proveedores de IA (via Replit AI Integrations)

# --- Anthropic Claude ---
export ANTHROPIC_API_KEY="$AI_INTEGRATIONS_ANTHROPIC_API_KEY"
export ANTHROPIC_BASE_URL="$AI_INTEGRATIONS_ANTHROPIC_BASE_URL"

# --- OpenAI GPT ---
export OPENAI_API_KEY="$AI_INTEGRATIONS_OPENAI_API_KEY"
export OPENAI_BASE_URL="$AI_INTEGRATIONS_OPENAI_BASE_URL"

# --- Google Gemini ---
export GOOGLE_GENERATIVE_AI_API_KEY="$AI_INTEGRATIONS_GEMINI_API_KEY"

# --- Directorio de trabajo ---
export OPENCODE_CWD="/home/runner/workspace"

# Crear directorio de proyectos si no existe
mkdir -p /home/runner/workspace/proyectos

# Iniciar OpenCode
exec /home/runner/workspace/bin/opencode serve \
  --port "${PORT:-21293}" \
  --hostname 0.0.0.0
