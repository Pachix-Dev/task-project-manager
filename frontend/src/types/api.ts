export interface Project {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: number;
  projectId: number;
  title: string;
  description: string | null;
  status: "pending" | "completed";
  createdAt: string;
  completedAt: string | null;
  updatedAt: string;
}

export interface ProjectMetrics {
  projectId: number;
  totalTasks: number;
  completedTasks: number;
  progressPercentage: number;
  averageCompletionTimeMmSs: string | null;
}

export interface ApiResponse<T> {
  data: T;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}
