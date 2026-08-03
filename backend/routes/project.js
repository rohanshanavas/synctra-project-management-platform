import express from "express";
import { z } from "zod";
import { validateRequest } from "zod-express-middleware";
import { projectSchema } from "../libs/validateSchema.js";
import authMiddleware from "../middleware/authMiddleware.js";

import { createProject } from "../controllers/project.js";

const router = express.Router();

router.post("/:workspaceId/create-project",
    authMiddleware,
    validateRequest({
        params: z.object({
            workspaceId: z.string()
        }),
        body: projectSchema
    }),
    createProject
);

export default router;