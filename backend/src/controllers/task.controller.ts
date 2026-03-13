import type { Request, Response } from "express";
import { TaskService } from "../services/task.service.js";

export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  createTask = async (req: Request, res: Response) => {
    const projectId = (req.params as unknown as { projectId: number }).projectId;
    const task = await this.taskService.createTask(projectId, req.body);
    res.status(201).json({ data: task });
  };

  listProjectTasks = async (req: Request, res: Response) => {
    const projectId = (req.params as unknown as { projectId: number }).projectId;
    const tasks = await this.taskService.listProjectTasks(projectId);
    res.status(200).json({ data: tasks });
  };

  completeTask = async (req: Request, res: Response) => {
    const taskId = (req.params as unknown as { taskId: number }).taskId;
    const completedTask = await this.taskService.completeTask(taskId);
    res.status(200).json({
      data: {
        id: completedTask.id,
        status: completedTask.status,
        completedAt: completedTask.completedAt
      }
    });
  };
}
