// backend/src/server.ts
import express from "express";
import authRouter from "./routes/auth";
import bodyParser from "body-parser";

export function createApp() {
  const app = express();
  app.use(bodyParser.json());
  app.use("/api/auth", authRouter);
  app.get("/health", (_req, res) => res.json({ ok: true }));
  return app;
}

// helper used by tests to get app without listening
export async function startServer() {
  return createApp();
}
