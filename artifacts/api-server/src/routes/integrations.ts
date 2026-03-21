import { Router } from "express";
import { db, integrationsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

// Listar todas las integraciones
router.get("/", async (_req, res) => {
  try {
    const integrations = await db.select().from(integrationsTable);
    res.json({ integrations });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Guardar una nueva integración
router.post("/", async (req, res) => {
  const { name, accountEmail, provider, credentials } = req.body;
  try {
    const [newIntegration] = await db.insert(integrationsTable).values({
      name,
      accountEmail,
      provider,
      credentials,
    }).returning();
    res.json({ integration: newIntegration });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar una integración
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.delete(integrationsTable).where(eq(integrationsTable.id, id));
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
