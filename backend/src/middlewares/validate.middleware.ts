import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";
import { AppError } from "../errors/app-error.js";
import { ERROR_CODES } from "../errors/error-codes.js";

export function validate(schema: ZodSchema, target: "body" | "params" = "body") {
  return (req: Request, _res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req[target]);

    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      next(
        new AppError(400, ERROR_CODES.VALIDATION_ERROR, "Invalid request", {
          field: issue?.path.join("."),
          message: issue?.message
        })
      );
      return;
    }

    req[target] = parsed.data;
    next();
  };
}
