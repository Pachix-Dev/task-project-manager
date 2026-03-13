import { describe, expect, it } from "vitest";
import { AppError } from "../src/errors/app-error.js";
import { TaskService } from "../src/services/task.service.js";

const now = new Date("2026-03-12T10:00:00.000Z");

function createTask(status: "pending" | "completed" = "pending") {
  return {
    id: 1,
    projectId: 1,
    title: "Tarea",
    description: null,
    status,
    createdAt: now,
    completedAt: status === "completed" ? now : null,
    updatedAt: now
  };
}

describe("TaskService", () => {
  it("creates task when project exists", async () => {
    const taskRepository = {
      create: async (input: { projectId: number; title: string; description?: string }) => ({
        ...createTask(),
        ...input
      }),
      findManyByProjectId: async () => [createTask()],
      findById: async () => createTask(),
      markCompleted: async () => createTask("completed")
    };

    const projectRepository = {
      findById: async () => ({ id: 1 })
    };

    const service = new TaskService(taskRepository as never, projectRepository as never);
    const result = await service.createTask(1, { title: "Nueva tarea" });

    expect(result.title).toBe("Nueva tarea");
  });

  it("throws conflict when task is already completed", async () => {
    const taskRepository = {
      create: async () => createTask(),
      findManyByProjectId: async () => [createTask()],
      findById: async () => createTask("completed"),
      markCompleted: async () => createTask("completed")
    };

    const projectRepository = {
      findById: async () => ({ id: 1 })
    };

    const service = new TaskService(taskRepository as never, projectRepository as never);

    await expect(service.completeTask(1)).rejects.toBeInstanceOf(AppError);
    await expect(service.completeTask(1)).rejects.toMatchObject({ statusCode: 409 });
  });
});
