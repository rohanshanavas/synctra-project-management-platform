import express from "express";
import { z } from "zod";
import authMiddleware from "../middleware/authMiddleware.js";
import { validateRequest } from "zod-express-middleware";
import { taskSchema } from "../libs/validateSchema.js";
import { createTask } from "../controllers/task.js";

const router = express.Router();

router.post("/:projectId/create-task",
    authMiddleware,
    validateRequest({
        params: z.object({
            projectId: z.string()
        }),
        body: taskSchema
    }),
    createTask
);

export default router;