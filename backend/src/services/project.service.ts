import type { Project, Task } from "@prisma/client";
import { AppError } from "../errors/app-error.js";
import { ERROR_CODES } from "../errors/error-codes.js";
import { ProjectRepository } from "../repositories/project.repository.js";
import { TaskRepository } from "../repositories/task.repository.js";

interface ProjectMetrics {
  projectId: number;
  totalTasks: number;
  completedTasks: number;
  progressPercentage: number;
  averageCompletionTimeInHours: number | null;
}

export class ProjectService {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly taskRepository: TaskRepository
  ) {}

  createProject(input: { name: string; description?: string }): Promise<Project> {
    return this.projectRepository.create(input);
  }

  listProjects(): Promise<Project[]> {
    return this.projectRepository.findMany();
  }

  async getProjectById(projectId: number): Promise<Project> {
    const project = await this.projectRepository.findById(projectId);

    if (!project) {
      throw new AppError(404, ERROR_CODES.PROJECT_NOT_FOUND, "Project not found");
    }

    return project;
  }

  async getProjectMetrics(projectId: number): Promise<ProjectMetrics> {
    await this.getProjectById(projectId);
    const tasks = await this.taskRepository.findManyByProjectId(projectId);

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task) => task.status === "completed").length;
    const progressPercentage =
      totalTasks === 0 ? 0 : Number(((completedTasks / totalTasks) * 100).toFixed(2));

    const averageCompletionTimeInHours = this.computeAverageCompletionHours(tasks);

    return {
      projectId,
      totalTasks,
      completedTasks,
      progressPercentage,
      averageCompletionTimeInHours
    };
  }

  private computeAverageCompletionHours(tasks: Task[]): number | null {
    const durations = tasks
      .filter((task) => task.status === "completed" && task.completedAt)
      .map((task) => {
        const completedAt = task.completedAt as Date;
        return (completedAt.getTime() - task.createdAt.getTime()) / 36e5;
      });

    if (durations.length === 0) {
      return null;
    }

    const average = durations.reduce((acc, current) => acc + current, 0) / durations.length;
    return Number(average.toFixed(2));
  }
}
