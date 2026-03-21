#!/bin/bash
export ANTHROPIC_API_KEY="$AI_INTEGRATIONS_ANTHROPIC_API_KEY"
export ANTHROPIC_BASE_URL="$AI_INTEGRATIONS_ANTHROPIC_BASE_URL"
exec /home/runner/workspace/bin/opencode serve --port ${PORT:-21293} --hostname 0.0.0.0
