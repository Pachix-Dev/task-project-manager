import { pino } from "pino";
import { env } from "../config/env.js";

export const logger = pino({
  level: env.LOG_LEVEL,
  base: {
    service: "task-project-manager-api"
  },
  timestamp: pino.stdTimeFunctions.isoTime
});
