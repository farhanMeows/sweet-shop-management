// backend/tests/me.test.ts
import request from "supertest";
import { PrismaClient } from "@prisma/client";
import { startServer } from "../src/server";

const prisma = new PrismaClient();
let app: any;
let token: string;

beforeAll(async () => {
  app = await startServer();
  await prisma.user.deleteMany({});
  const res = await request(app)
    .post("/api/auth/register")
    .send({ name: "Tester", email: "me@example.com", password: "pass1234" });

  const login = await request(app)
    .post("/api/auth/login")
    .send({ email: "me@example.com", password: "pass1234" });

  token = login.body.token;
});

afterAll(async () => {
  await prisma.$disconnect();
});

test("GET /api/me returns user when authenticated", async () => {
  const res = await request(app)
    .get("/api/me")
    .set("Authorization", `Bearer ${token}`);

  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty("user");
  expect(res.body.user).toHaveProperty("email", "me@example.com");
});

test("GET /api/me without token returns 401", async () => {
  const res = await request(app).get("/api/me");
  expect(res.status).toBe(401);
});
