import { z } from "zod";

export const createProjectBodySchema = z.object({
  name: z.string().trim().min(1).max(150),
  description: z.string().trim().min(1).optional()
});

export const projectIdParamSchema = z.object({
  projectId: z.coerce.number().int().positive()
});
