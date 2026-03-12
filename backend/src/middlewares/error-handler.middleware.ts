import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../errors/app-error.js";
import { ERROR_CODES } from "../errors/error-codes.js";
import { logger } from "../logger/logger.js";

export function errorHandlerMiddleware(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        details: err.details
      }
    });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      error: {
        code: ERROR_CODES.VALIDATION_ERROR,
        message: "Invalid request",
        details: err.issues
      }
    });
    return;
  }

  logger.error({
    route: req.originalUrl,
    method: req.method,
    requestId: req.requestId,
    err,
    message: "Unhandled error"
  });

  res.status(500).json({
    error: {
      code: ERROR_CODES.INTERNAL_SERVER_ERROR,
      message: "Internal server error"
    }
  });
}
