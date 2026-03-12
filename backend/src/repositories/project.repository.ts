import type { Project } from "@prisma/client";
import { prisma } from "../config/database.js";

export class ProjectRepository {
  async create(input: { name: string; description?: string }): Promise<Project> {
    return prisma.project.create({ data: input });
  }

  async findMany(): Promise<Project[]> {
    return prisma.project.findMany({ orderBy: { createdAt: "desc" } });
  }

  async findById(projectId: number): Promise<Project | null> {
    return prisma.project.findUnique({ where: { id: projectId } });
  }
}
