import express from "express";
import authRouter from "./routes/auth";
import meRouter from "./routes/me";
import sweetsRouter from "./routes/sweets";
import bodyParser from "body-parser";
import cors from "cors";

export function createApp() {
  const app = express();
  const raw = process.env.ALLOWED_ORIGINS || "";
  const allowedOrigins = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const corsOptions = {
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, ok?: boolean) => void
    ) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);

      // If allowedOrigins empty => allow everything (useful for quick testing BUT not recommended for long-term)
      if (allowedOrigins.length === 0) return callback(null, true);

      // If origin is in the whitelist, allow it
      if (allowedOrigins.includes(origin)) return callback(null, true);

      // Otherwise reject
      return callback(new Error(`CORS policy: origin ${origin} not allowed`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  };

  // Use CORS middleware
  app.use(cors(corsOptions));

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
