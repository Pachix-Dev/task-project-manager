import { Router } from "express";
import { ProjectController } from "../controllers/project.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createProjectBodySchema, projectIdParamSchema } from "../validators/project.schemas.js";
import { asyncHandler } from "../utils/async-handler.js";

export function buildProjectRoutes(projectController: ProjectController): Router {
  const router = Router();

  router.post("/", 
    validate(createProjectBodySchema), 
    asyncHandler(projectController.createProject)
);

  router.get("/", 
    asyncHandler(projectController.listProjects)
);

  router.get(
    "/:projectId",
    validate(projectIdParamSchema, "params"),
    asyncHandler(projectController.getProjectById)
  );

  router.get(
    "/:projectId/metrics",
    validate(projectIdParamSchema, "params"),
    asyncHandler(projectController.getProjectMetrics)
  );

  return router;
}
