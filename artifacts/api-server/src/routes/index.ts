import { Router, type IRouter } from "express";
import healthRouter from "./health";
import filesRouter from "./files";
import terminalRouter from "./terminal";
import modelsRouter from "./models";
import projectsRouter from "./projects";
import integrationsRouter from "./integrations";

const router: IRouter = Router();

router.use("/health", healthRouter);
router.use("/files", filesRouter);
router.use("/terminal", terminalRouter);
router.use("/models", modelsRouter);
router.use("/projects", projectsRouter);
router.use("/integrations", integrationsRouter);

export default router;
