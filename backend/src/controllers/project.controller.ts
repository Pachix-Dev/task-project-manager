import type { Request, Response } from "express";
import { ProjectService } from "../services/project.service.js";

export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  createProject = async (req: Request, res: Response) => {
    const project = await this.projectService.createProject(req.body);
    res.status(201).json({ data: project });
  };

  listProjects = async (_req: Request, res: Response) => {
    const projects = await this.projectService.listProjects();
    res.status(200).json({ data: projects });
  };

  getProjectById = async (req: Request, res: Response) => {
    const projectId = (req.params as unknown as { projectId: number }).projectId;
    const project = await this.projectService.getProjectById(projectId);
    res.status(200).json({ data: project });
  };

  getProjectMetrics = async (req: Request, res: Response) => {
    const projectId = (req.params as unknown as { projectId: number }).projectId;
    const metrics = await this.projectService.getProjectMetrics(projectId);
    res.status(200).json({ data: metrics });
  };
}
