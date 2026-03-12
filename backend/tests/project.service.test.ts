import { describe, expect, it } from "vitest";
import { ProjectService } from "../src/services/project.service.js";

const now = new Date("2026-03-12T10:00:00.000Z");

function createProject(id = 1) {
  return {
    id,
    name: "Proyecto Alpha",
    description: "demo",
    createdAt: now,
    updatedAt: now
  };
}

describe("ProjectService", () => {
  it("creates a project", async () => {
    const projectRepository = {
      create: async (input: { name: string; description?: string }) => ({
        ...createProject(),
        ...input
      }),
      findMany: async () => [createProject()],
      findById: async () => createProject()
    };

    const taskRepository = {
      findManyByProjectId: async () => []
    };

    const service = new ProjectService(projectRepository as never, taskRepository as never);
    const result = await service.createProject({ name: "Nuevo" });

    expect(result.name).toBe("Nuevo");
  });

  it("returns zero progress for projects with no tasks", async () => {
    const projectRepository = {
      create: async () => createProject(),
      findMany: async () => [createProject()],
      findById: async () => createProject()
    };

    const taskRepository = {
      findManyByProjectId: async () => []
    };

    const service = new ProjectService(projectRepository as never, taskRepository as never);
    const metrics = await service.getProjectMetrics(1);

    expect(metrics.progressPercentage).toBe(0);
    expect(metrics.averageCompletionTimeInHours).toBeNull();
  });

  it("calculates metrics using only completed tasks", async () => {
    const projectRepository = {
      create: async () => createProject(),
      findMany: async () => [createProject()],
      findById: async () => createProject()
    };

    const taskRepository = {
      findManyByProjectId: async () => [
        {
          id: 1,
          projectId: 1,
          title: "A",
          description: null,
          status: "completed",
          createdAt: new Date("2026-03-12T10:00:00.000Z"),
          completedAt: new Date("2026-03-12T12:00:00.000Z"),
          updatedAt: now
        },
        {
          id: 2,
          projectId: 1,
          title: "B",
          description: null,
          status: "pending",
          createdAt: now,
          completedAt: null,
          updatedAt: now
        }
      ]
    };

    const service = new ProjectService(projectRepository as never, taskRepository as never);
    const metrics = await service.getProjectMetrics(1);

    expect(metrics.totalTasks).toBe(2);
    expect(metrics.completedTasks).toBe(1);
    expect(metrics.progressPercentage).toBe(50);
    expect(metrics.averageCompletionTimeInHours).toBe(2);
  });
});
