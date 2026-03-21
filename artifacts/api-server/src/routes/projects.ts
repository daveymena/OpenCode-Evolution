import { Router, type IRouter } from "express";
import { db, projectsTable, workspaceStateTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import fs from "fs/promises";
import path from "path";

const router: IRouter = Router();
const WORKSPACE_PROYECTOS = path.join(process.env.WORKSPACE_ROOT || process.cwd(), "proyectos");

// Listar todos los proyectos
router.get("/projects", async (_req, res) => {
  try {
    const projects = await db.select().from(projectsTable);
    res.json({ projects });
  } catch (error) {
    res.status(500).json({ error: "Error al listar proyectos" });
  }
});

// Sincronizar proyectos (escanear carpeta proyectos/)
router.post("/projects/sync", async (_req, res) => {
  try {
    // Asegurar que la carpeta proyectos existe
    await fs.mkdir(WORKSPACE_PROYECTOS, { recursive: true });
    
    const entries = await fs.readdir(WORKSPACE_PROYECTOS, { withFileTypes: true });
    const directories = entries.filter(e => e.isDirectory()).map(e => e.name);
    
    for (const name of directories) {
      const projectPath = path.join("proyectos", name);
      // Solo insertar si no ya existe
      const existing = await db.select().from(projectsTable).where(eq(projectsTable.path, projectPath));
      if (existing.length === 0) {
        await db.insert(projectsTable).values({
          name: name,
          path: projectPath,
          type: "desconocido"
        });
      }
    }
    
    const projects = await db.select().from(projectsTable);
    res.json({ projects, message: "Sincronización completada" });
  } catch (error) {
    res.status(500).json({ error: "Error al sincronizar proyectos" });
  }
});

// Obtener estado del espacio de trabajo
router.get("/workspace/state", async (_req, res) => {
  try {
    const state = await db.select().from(workspaceStateTable);
    const stateMap = state.reduce((acc: any, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});
    res.json({ state: stateMap });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener estado" });
  }
});

// Actualizar estado del espacio de trabajo
router.post("/workspace/state", async (req, res) => {
  const { key, value } = req.body;
  try {
    const existing = await db.select().from(workspaceStateTable).where(eq(workspaceStateTable.key, key));
    if (existing.length > 0) {
      await db.update(workspaceStateTable).set({ value, updatedAt: new Date() }).where(eq(workspaceStateTable.key, key));
    } else {
      await db.insert(workspaceStateTable).values({ key, value });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar estado" });
  }
});

export default router;
