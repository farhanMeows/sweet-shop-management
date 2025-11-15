// backend/src/server.ts
import express from "express";
import bodyParser from "body-parser";
import authRouter from "./routes/auth";
import meRouter from "./routes/me";

/**
 * createApp - builds and returns an Express app WITHOUT listening.
 * This is useful for tests (supertest) and also for programmatic composition.
 */
export function createApp() {
  const app = express();
  app.use(bodyParser.json());

  // health endpoint
  app.get("/health", (_req, res) => res.json({ ok: true }));

  // auth routes
  app.use("/api/auth", authRouter);

  // protected /api/me (meRouter uses auth middleware)
  app.use("/api", meRouter);

  return app;
}

/**
 * startServer - helper for tests. Returns the Express app instance.
 * Kept async to allow future async init steps if needed.
 */
export async function startServer() {
  return createApp();
}
