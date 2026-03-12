import type { NextFunction, Request, Response } from "express";
import { randomUUID } from "node:crypto";
import { logger } from "../logger/logger.js";

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  req.requestId = randomUUID();
  const start = Date.now();

  logger.info({
    route: req.originalUrl,
    method: req.method,
    requestId: req.requestId,
    message: "Incoming request"
  });

  res.on("finish", () => {
    logger.info({
      route: req.originalUrl,
      method: req.method,
      requestId: req.requestId,
      statusCode: res.statusCode,
      durationMs: Date.now() - start,
      message: "Request completed"
    });
  });

  next();
}
