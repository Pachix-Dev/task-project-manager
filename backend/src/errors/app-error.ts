import type { ErrorCode } from "./error-codes.js";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: ErrorCode;
  public readonly details?: Record<string, unknown>;

  constructor(statusCode: number, code: ErrorCode, message: string, details?: Record<string, unknown>) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    if (details !== undefined) {
      this.details = details;
    }
  }
}
