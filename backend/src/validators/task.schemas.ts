import { z } from "zod";

export const createTaskBodySchema = z.object({
  title: z.string().trim().min(1).max(150),
  description: z.string().trim().min(1).optional()
});

export const taskIdParamSchema = z.object({
  taskId: z.coerce.number().int().positive()
});
