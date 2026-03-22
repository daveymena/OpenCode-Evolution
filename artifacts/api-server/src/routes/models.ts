import { Router, type IRouter } from "express";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const router: IRouter = Router();

const workspaceRoot = process.env.OPENCODE_WORKSPACE || path.resolve(process.cwd(), "../../");
const configPath = path.join(workspaceRoot, ".config", "opencode", "opencode.json");

router.get("/models", (_req, res) => {
  let AVAILABLE_MODELS: any[] = [];
  try {
    const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    if (config.provider) {
      for (const [providerKey, providerData] of Object.entries(config.provider)) {
        const pd = providerData as any;
        if (pd.models) {
          for (const [modelId, modelData] of Object.entries(pd.models)) {
            AVAILABLE_MODELS.push({
              id: modelId,
              name: (modelData as any).name || modelId,
              provider: pd.name || providerKey,
              description: pd.name,
            });
          }
        }
      }
    }
  } catch (err) {
    AVAILABLE_MODELS = [
      { id: "claude-sonnet-4-6", name: "Claude Sonnet 4.6", provider: "Anthropic", description: "Default fallback" }
    ];
  }
  
  res.json({ models: AVAILABLE_MODELS });
});

export default router;
