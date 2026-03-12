import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { errorHandlerMiddleware } from "./middlewares/error-handler.middleware.js";
import { notFoundMiddleware } from "./middlewares/not-found.middleware.js";
import { requestLogger } from "./middlewares/request-logger.middleware.js";
import { buildApiRouter } from "./routes/index.js";

export function buildApp() {
  const app = express();

  app.use(
    cors({
      origin: env.CORS_ORIGIN
    })
  );
  app.use(express.json());
  app.use(requestLogger);

  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  app.use("/api", buildApiRouter());
  app.use(notFoundMiddleware);
  app.use(errorHandlerMiddleware);

  return app;
}
