import type { Task } from "@prisma/client";
import { prisma } from "../config/database.js";

export class TaskRepository {
  async create(input: { projectId: number; title: string; description?: string }): Promise<Task> {
    return prisma.task.create({ data: input });
  }

  async findManyByProjectId(projectId: number): Promise<Task[]> {
    return prisma.task.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" }
    });
  }

  async findById(taskId: number): Promise<Task | null> {
    return prisma.task.findUnique({ where: { id: taskId } });
  }

  async markCompleted(taskId: number): Promise<Task> {
    return prisma.task.update({
      where: { id: taskId },
      data: {
        status: "completed",
        completedAt: new Date()
      }
    });
  }
}
