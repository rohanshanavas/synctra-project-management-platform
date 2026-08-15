import express from "express";
import { z } from "zod";
import { validateRequest } from "zod-express-middleware";
import { transferWorkspaceOwnershipSchema, workspaceSchema, workspaceUpdateSchema } from "../libs/validateSchema.js";
import authMiddleware from "../middleware/authMiddleware.js";
import {
    createWorkspace,
    deleteWorkspace,
    getArchivedItems,
    getWorkspaceDetails,
    getWorkspaceProjects,
    getWorkspaces,
    getWorkspaceStats,
    transferWorkspaceOwnership,
    updateWorkspace
} from "../controllers/workspace.js";

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

router.put("/:workspaceId",
    authMiddleware,
    validateRequest({
        params: z.object({
            workspaceId: z.string()
        }),
        body: workspaceUpdateSchema
    }),
    updateWorkspace
);

router.put("/:workspaceId/transfer-ownership",
    authMiddleware,
    validateRequest({
        params: z.object({
            workspaceId: z.string()
        }),
        body: transferWorkspaceOwnershipSchema
    }),
    transferWorkspaceOwnership
);

router.delete("/:workspaceId",
    authMiddleware,
    validateRequest({
        params: z.object({
            workspaceId: z.string()
        })
    }),
    deleteWorkspace
);

export default router;