import express from "express";
import { z } from "zod";
import { validateRequest } from "zod-express-middleware";
import { inviteMemberSchema, transferWorkspaceOwnershipSchema, workspaceSchema, workspaceUpdateSchema } from "../libs/validateSchema.js";
import authMiddleware from "../middleware/authMiddleware.js";
import {
    acceptInviteByToken,
    acceptWorkspaceInvite,
    createWorkspace,
    deleteWorkspace,
    getArchivedItems,
    getWorkspaceDetails,
    getWorkspaceProjects,
    getWorkspaces,
    getWorkspaceStats,
    inviteMembertoWorkspace,
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

router.post("/accept-invite-token",
    authMiddleware,
    validateRequest({
        body: z.object({
            token: z.string()
        })
    }),
    acceptInviteByToken
);

router.post("/:workspaceId/invite-member",
    authMiddleware,
    validateRequest({
        params: z.object({
            workspaceId: z.string()
        }),
        body: inviteMemberSchema
    }),
    inviteMembertoWorkspace
);

router.post("/:workspaceId/accept-invite",
    authMiddleware,
    validateRequest({
        params: z.object({
            workspaceId: z.string()
        })
    }),
    acceptWorkspaceInvite
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