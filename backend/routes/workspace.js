import express from "express";
import { validateRequest } from "zod-express-middleware";
import { workspaceSchema } from "../libs/validateSchema.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { createWorkspace, getWorkspaceDetails, getWorkspaceProjects, getWorkspaces, getWorkspaceStats, getArchivedItems } from "../controllers/workspace.js";

const router = express.Router();

router.post("/",
    authMiddleware,
    validateRequest({
        body: workspaceSchema
    }),
    createWorkspace
);

router.get("/", authMiddleware, getWorkspaces);

router.get("/:workspaceId", authMiddleware, getWorkspaceDetails);

router.get("/:workspaceId/projects", authMiddleware, getWorkspaceProjects);

router.get("/:workspaceId/stats", authMiddleware, getWorkspaceStats);

router.get("/:workspaceId/archived", authMiddleware, getArchivedItems);

export default router;