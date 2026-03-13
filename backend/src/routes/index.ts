import { Router } from "express";
import { ProjectController } from "../controllers/project.controller.js";
import { TaskController } from "../controllers/task.controller.js";
import { ProjectRepository } from "../repositories/project.repository.js";
import { TaskRepository } from "../repositories/task.repository.js";
import { ProjectService } from "../services/project.service.js";
import { TaskService } from "../services/task.service.js";
import { buildProjectRoutes } from "./project.routes.js";
import { buildTaskRoutes } from "./task.routes.js";

export function buildApiRouter(): Router {
  const projectRepository = new ProjectRepository();
  const taskRepository = new TaskRepository();

  const projectService = new ProjectService(projectRepository, taskRepository);
  const taskService = new TaskService(taskRepository, projectRepository);

  const projectController = new ProjectController(projectService);
  const taskController = new TaskController(taskService);

  const router = Router();
  router.use("/projects", buildProjectRoutes(projectController));
  router.use("/", buildTaskRoutes(taskController));

  return router;
}
