import request from "supertest";
import { PrismaClient } from "@prisma/client";
import { startServer } from "../src/server";

const prisma = new PrismaClient();

let app: any;

beforeAll(async () => {
  app = await startServer();

  await prisma.user.deleteMany({});
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Auth: register & login", () => {
  const email = "testuser@example.com";
  const password = "password123";

  test("POST /api/auth/register should register a user and return 201", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "Test", email, password });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("email", email);
    expect(res.body).not.toHaveProperty("password");
  });

  test("POST /api/auth/register duplicate should return 400", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "Test", email, password });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  test("POST /api/auth/login should return JWT token on valid creds", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email, password });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(typeof res.body.token).toBe("string");
  });

  test("POST /api/auth/login invalid creds should return 401", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email, password: "wrong" });

    expect(res.status).toBe(401);
  });
});
