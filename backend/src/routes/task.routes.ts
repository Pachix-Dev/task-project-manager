import { Router } from "express";
import { TaskController } from "../controllers/task.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { asyncHandler } from "../utils/async-handler.js";
import { projectIdParamSchema } from "../validators/project.schemas.js";
import { createTaskBodySchema, taskIdParamSchema } from "../validators/task.schemas.js";

export function buildTaskRoutes(taskController: TaskController): Router {
  const router = Router();

  router.post(
    "/projects/:projectId/tasks",
    validate(projectIdParamSchema, "params"),
    validate(createTaskBodySchema),
    asyncHandler(taskController.createTask)
  );

  router.get(
    "/projects/:projectId/tasks",
    validate(projectIdParamSchema, "params"),
    asyncHandler(taskController.listProjectTasks)
  );

  router.patch(
    "/tasks/:taskId/complete",
    validate(taskIdParamSchema, "params"),
    asyncHandler(taskController.completeTask)
  );

  return router;
}
