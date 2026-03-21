import { Router } from "express";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);
const router = Router();

// ── Estado de procesos PM2 ─────────────────────────────────
router.get("/pm2/list", async (_req, res) => {
  try {
    const { stdout } = await execAsync("pm2 jlist 2>/dev/null || echo '[]'");
    const processes = JSON.parse(stdout || "[]");
    res.json({ processes });
  } catch (err: any) {
    res.json({ processes: [], error: err.message });
  }
});

// ── Iniciar un bot/script en background ───────────────────
router.post("/pm2/start", async (req, res) => {
  const { name, script, cwd, interpreter } = req.body;
  if (!script || !name) {
    return res.status(400).json({ error: "name y script son requeridos" }) as any;
  }
  try {
    const interp = interpreter || "python3";
    const dir = cwd || "/workspace/proyectos";
    const { stdout } = await execAsync(
      `pm2 start ${script} --name "${name}" --interpreter ${interp} --cwd "${dir}" 2>&1`
    );
    res.json({ success: true, output: stdout });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ── Detener un proceso ─────────────────────────────────────
router.post("/pm2/stop/:name", async (req, res) => {
  try {
    const { stdout } = await execAsync(`pm2 stop "${req.params.name}" 2>&1`);
    res.json({ success: true, output: stdout });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ── Logs de un proceso ─────────────────────────────────────
router.get("/pm2/logs/:name", async (req, res) => {
  try {
    const { stdout } = await execAsync(
      `pm2 logs "${req.params.name}" --lines 100 --nostream 2>&1 || echo "Sin logs aún"`
    );
    res.json({ logs: stdout });
  } catch (err: any) {
    res.json({ logs: "", error: err.message });
  }
});

// ── MCP GitHub: push automático ───────────────────────────
router.post("/github/push", async (req, res) => {
  const { dir, message, token, repo } = req.body;
  const workDir = dir || "/workspace/proyectos";
  const commitMsg = message || "Auto-commit desde OpenCode OS Evolution";
  try {
    let cmds = `cd "${workDir}" && git add -A && git commit -m "${commitMsg}" 2>&1`;
    if (token && repo) {
      cmds += ` && git push https://${token}@github.com/${repo}.git HEAD 2>&1`;
    } else {
      cmds += ` && git push 2>&1`;
    }
    const { stdout } = await execAsync(cmds);
    res.json({ success: true, output: stdout });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ── MCP GitHub: clonar repositorio ────────────────────────
router.post("/github/clone", async (req, res) => {
  const { repoUrl, name, token } = req.body;
  if (!repoUrl) return res.status(400).json({ error: "repoUrl requerido" }) as any;
  try {
    const dest = `/workspace/proyectos/${name || "repo"}`;
    let url = repoUrl;
    if (token) {
      url = repoUrl.replace("https://", `https://${token}@`);
    }
    const { stdout } = await execAsync(`git clone "${url}" "${dest}" 2>&1`);
    res.json({ success: true, path: dest, output: stdout });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ── Ejecutar script Python ─────────────────────────────────
router.post("/python/run", async (req, res) => {
  const { script, args = "", timeout = 30000 } = req.body;
  if (!script) return res.status(400).json({ error: "script requerido" }) as any;
  try {
    const { stdout, stderr } = await execAsync(
      `python3 ${script} ${args} 2>&1`,
      { timeout, cwd: "/workspace/proyectos" }
    );
    res.json({ success: true, output: stdout, errors: stderr });
  } catch (err: any) {
    res.status(500).json({ error: err.message, output: err.stdout });
  }
});

export default router;
