import { apiClient } from "./api-client";
import type { Project, ProjectMetrics } from "../types/api";

export async function getProjects() {
  return apiClient<Project[]>("/projects");
}

export async function getProject(projectId: number) {
  return apiClient<Project>(`/projects/${projectId}`);
}

export async function getProjectMetrics(projectId: number) {
  return apiClient<ProjectMetrics>(`/projects/${projectId}/metrics`);
}

export async function createProject(input: { name: string; description?: string }) {
  return apiClient<Project>("/projects", {
    method: "POST",
    body: JSON.stringify(input)
  });
}
