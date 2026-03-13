import type { ApiError, ApiResponse } from "../types/api";

const SERVER_API_BASE_URL = process.env.API_BASE_URL_SERVER ?? "http://backend:3001/api";
const CLIENT_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001/api";

export async function apiClient<T>(path: string, init?: RequestInit): Promise<ApiResponse<T>> {
  const baseUrl = typeof window === "undefined" ? SERVER_API_BASE_URL : CLIENT_API_BASE_URL;

  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    },
    cache: "no-store"
  });

  const payload = (await response.json()) as ApiResponse<T> | ApiError;

  if (!response.ok) {
    const message = "error" in payload ? payload.error.message : "Request failed";
    throw new Error(message);
  }

  return payload as ApiResponse<T>;
}
