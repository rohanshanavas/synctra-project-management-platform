import express from "express";
import { z } from "zod";
import authMiddleware from "../middleware/authMiddleware.js";
import { validateRequest } from "zod-express-middleware";
import { taskSchema } from "../libs/validateSchema.js";
import { createTask, getTaskById, updateTaskTitle } from "../controllers/task.js";

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

router.put("/:taskId/title",
    authMiddleware,
    validateRequest({
        params: z.object({
            taskId: z.string()
        }),
        body: z.object({
            title: z.string()
        })
    }),
    updateTaskTitle
);

router.get("/:taskId", 
    authMiddleware,
    validateRequest({
        params: z.object({
            taskId: z.string()
        })
    }),
    getTaskById
);

export default router;