import { Router } from "express";
import { streamText } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { createGroq } from "@ai-sdk/groq";
import { createAnthropic } from "@ai-sdk/anthropic";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import "dotenv/config"; // Ensure .env is loaded

const router = Router();

// Define fallback initialization based on env variables
// Load the config file
const workspaceRoot = process.env.OPENCODE_WORKSPACE || path.resolve(process.cwd(), "../../");
const configPath = path.join(workspaceRoot, ".config", "opencode", "opencode.json");

let config: any = {};
try {
  config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
} catch (error) {
  console.warn("No opencode.json found at", configPath);
}

const groq = createGroq({ apiKey: process.env.GROQ_API_KEY });
const openRouter = createOpenRouter({ apiKey: process.env.OPENROUTER_API_KEY });
const anthropic = createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

router.post("/", async (req: any, res: any) => {
  const { sessionId, message, model, systemPrompt } = req.body;

  if (!message || !model) {
    res.status(400).json({ error: "mensaje y modelo son requeridos" });
    return;
  }

  // Identify provider by matching model ID in config
  let selectedProvider = "openrouter"; // default fallback
  if (config.provider) {
    for (const [providerKey, providerData] of Object.entries(config.provider)) {
      if ((providerData as any).models && (providerData as any).models[model]) {
        selectedProvider = providerKey;
        break;
      }
    }
  }

  // For IDs that include a slash but weren't found in config, assume OpenRouter
  if (model.includes("/") && selectedProvider !== "openrouter") {
    selectedProvider = "openrouter";
  }

  // Get the correct ai-sdk model instance
  let aiModel;
  try {
    if (selectedProvider === "groq") {
      aiModel = groq(model);
    } else if (selectedProvider === "anthropic") {
      aiModel = anthropic(model);
    } else {
      // openrouter covers the free Qwen, Nemotron, Grok, Minimax, etc
      aiModel = openRouter(model);
    }
  } catch (error) {
    aiModel = openRouter(model);
  }

  // Set headers for SSE response
  res.writeHead(200, {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-cache, no-transform",
    "Connection": "keep-alive",
  });

  try {
    const formattedMessages: any[] = [
      { role: "system", content: systemPrompt || "Eres OpenCode OS Evo, un asistente de IA avanzado e integrado en el entorno de desarrollo." },
      { role: "user", content: message }
    ];

    const result = streamText({
      model: aiModel,
      messages: formattedMessages,
      temperature: 0.7
    });

    for await (const textPart of result.textStream) {
      if (textPart) {
        res.write(`data: ${JSON.stringify({ content: textPart })}\n\n`);
      }
    }

  } catch (error: any) {
    console.error("Chat Stream Error:", error);
    res.write(`data: ${JSON.stringify({ content: "\n\n[Error: No se pudo conectar con el proveedor del modelo o la API Key no está configurada: " + error.message + " ]" })}\n\n`);
  } finally {
    res.write(`data: [DONE]\n\n`);
    res.end();
  }
});

export default router;
