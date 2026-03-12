import { prisma } from "./config/database.js";
import { env } from "./config/env.js";
import { logger } from "./logger/logger.js";
import { buildApp } from "./app.js";

const app = buildApp();

const server = app.listen(env.PORT, () => {
  logger.info({
    port: env.PORT,
    message: "API server started"
  });
});

async function gracefulShutdown() {
  logger.info({ message: "Shutdown signal received" });
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);
