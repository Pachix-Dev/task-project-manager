import { apiClient } from "./api-client";
import type { Task } from "../types/api";

export async function getProjectTasks(projectId: number) {
  return apiClient<Task[]>(`/projects/${projectId}/tasks`);
}

export async function createTask(projectId: number, input: { title: string; description?: string }) {
  return apiClient<Task>(`/projects/${projectId}/tasks`, {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export async function completeTask(taskId: number) {
  return apiClient<Pick<Task, "id" | "status" | "completedAt">>(`/tasks/${taskId}/complete`, {
    method: "PATCH"
  });
}
