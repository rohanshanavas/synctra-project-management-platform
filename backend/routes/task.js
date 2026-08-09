import express from "express";
import { z } from "zod";
import authMiddleware from "../middleware/authMiddleware.js";
import { validateRequest } from "zod-express-middleware";
import { taskSchema } from "../libs/validateSchema.js";
import { createTask, getTaskById, updateTaskDescription, updateTaskTitle, updateTaskStatus, updateTaskAssignees, updateTaskPriority, addSubtask, updateSubtask, getActivitybyResourceId, addComment, getCommentsByTaskId, watchTask, archiveTask } from "../controllers/task.js";

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

router.post("/:taskId/add-subtask",
    authMiddleware,
    validateRequest({
        params: z.object({
            taskId: z.string()
        }),
        body: z.object({
            title: z.string(),
        })
    }),
    addSubtask
);

router.post("/:taskId/add-comment",
    authMiddleware,
    validateRequest({
        params: z.object({
            taskId: z.string()
        }),
        body: z.object({
            text: z.string()
        })
    }),
    addComment
);

router.post("/:taskId/watch",
    authMiddleware,
    validateRequest({
        params: z.object({
            taskId: z.string()
        })
    }),
    watchTask
);

router.post("/:taskId/archive",
    authMiddleware,
    validateRequest({
        params: z.object({
            taskId: z.string()
        })
    }),
    archiveTask
);

router.put("/:taskId/update-subtask/:subtaskId",
    authMiddleware,
    validateRequest({
        params: z.object({
            taskId: z.string(),
            subtaskId: z.string()
        }),
        body: z.object({
            completed: z.boolean()
        })
    }),
    updateSubtask
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

router.put("/:taskId/description",
    authMiddleware,
    validateRequest({
        params: z.object({
            taskId: z.string()
        }),
        body: z.object({
            description: z.string()
        })
    }),
    updateTaskDescription
);

router.put("/:taskId/status",
    authMiddleware,
    validateRequest({
        params: z.object({
            taskId: z.string()
        }),
        body: z.object({
            status: z.string()
        })
    }),
    updateTaskStatus
);

router.put("/:taskId/assignees",
    authMiddleware,
    validateRequest({
        params: z.object({
            taskId: z.string()
        }),
        body: z.object({
            assignees: z.array(z.string())
        })
    }),
    updateTaskAssignees
);

router.put("/:taskId/priority",
    authMiddleware,
    validateRequest({
        params: z.object({
            taskId: z.string()
        }),
        body: z.object({
            priority: z.string()
        })
    }),
    updateTaskPriority
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

router.get("/:resourceId/activity",
    authMiddleware,
    validateRequest({
        params: z.object({
            resourceId: z.string()
        })
    }),
    getActivitybyResourceId
);

router.get("/:taskId/comments",
    authMiddleware,
    validateRequest({
        params: z.object({
            taskId: z.string()
        })
    }),
    getCommentsByTaskId
);

export default router;