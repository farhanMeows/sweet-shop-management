// backend/src/server.ts (DEBUG version)
import express from "express";
import authRouter from "./routes/auth";
import meRouter from "./routes/me";
import sweetsRouter from "./routes/sweets";
import bodyParser from "body-parser";

export function createApp() {
  const app = express();

  // Very small logger to see incoming requests
  app.use((req, _res, next) => {
    console.log(new Date().toISOString(), "INCOMING", req.method, req.url);
    next();
  });

  // quick debug route that never touches DB
  app.get("/health-no-db", (_req, res) => {
    res.json({ ok: true, db: "skipped" });
  });

  app.use(bodyParser.json());
  app.use("/api/auth", authRouter);
  app.use("/api", meRouter); // provides /api/me
  app.use("/api/sweets", sweetsRouter);

  // original health endpoint
  app.get("/health", (_req, res) => res.json({ ok: true }));

  return app;
}

// helper used by tests to get app without listening
export async function startServer() {
  return createApp();
}
