import express from "express";
import authRouter from "./routes/auth";
import meRouter from "./routes/me";
import sweetsRouter from "./routes/sweets";
import bodyParser from "body-parser";
import cors from "cors";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: process.env.ALLOWED_ORIGINS?.split(",") || true, // recommended: only allow Vercel URL
      credentials: true,
    })
  );

  app.use((req, _res, next) => {
    console.log(new Date().toISOString(), "INCOMING", req.method, req.url);
    next();
  });

  app.get("/health-no-db", (_req, res) => {
    res.json({ ok: true, db: "skipped" });
  });

  app.use(bodyParser.json());
  app.use("/api/auth", authRouter);
  app.use("/api", meRouter);
  app.use("/api/sweets", sweetsRouter);

  app.get("/health", (_req, res) => res.json({ ok: true }));

  return app;
}

export async function startServer() {
  return createApp();
}
