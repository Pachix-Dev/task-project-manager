import type { Task } from "@prisma/client";
import { AppError } from "../errors/app-error.js";
import { ERROR_CODES } from "../errors/error-codes.js";
import { ProjectRepository } from "../repositories/project.repository.js";
import { TaskRepository } from "../repositories/task.repository.js";

export class TaskService {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly projectRepository: ProjectRepository
  ) {}

  async createTask(
    projectId: number,
    input: { title: string; description?: string }
  ): Promise<Task> {
    const project = await this.projectRepository.findById(projectId);

    if (!project) {
      throw new AppError(404, ERROR_CODES.PROJECT_NOT_FOUND, "Project not found");
    }

    return this.taskRepository.create({
      projectId,
      title: input.title,
      ...(input.description ? { description: input.description } : {})
    });
  }

  async listProjectTasks(projectId: number): Promise<Task[]> {
    const project = await this.projectRepository.findById(projectId);

    if (!project) {
      throw new AppError(404, ERROR_CODES.PROJECT_NOT_FOUND, "Project not found");
    }

    return this.taskRepository.findManyByProjectId(projectId);
  }

  async completeTask(taskId: number): Promise<Task> {
    const task = await this.taskRepository.findById(taskId);

    if (!task) {
      throw new AppError(404, ERROR_CODES.TASK_NOT_FOUND, "Task not found");
    }

    if (task.status === "completed") {
      throw new AppError(409, ERROR_CODES.TASK_ALREADY_COMPLETED, "Task already completed");
    }

    return this.taskRepository.markCompleted(taskId);
  }
}
