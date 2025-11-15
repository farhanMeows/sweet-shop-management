// backend/tests/sweets.test.ts
import request from "supertest";
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { startServer } from "../src/server";

const prisma = new PrismaClient();
let app: any;
let adminToken: string;
let userToken: string;

beforeAll(async () => {
  app = await startServer();

  // Clean up
  await prisma.sweet.deleteMany({});
  await prisma.user.deleteMany({});

  // create admin user directly in DB
  const adminPw = await bcrypt.hash("adminpass", 10);
  await prisma.user.create({
    data: {
      email: "admin@local.test",
      password: adminPw,
      name: "Admin",
      role: Role.ADMIN,
    },
  });

  // create normal user via register endpoint to ensure paths are exercised
  await request(app)
    .post("/api/auth/register")
    .send({ name: "Normal", email: "user@local.test", password: "userpass" })
    .expect(201);

  // login admin to get token
  const adminLogin = await request(app)
    .post("/api/auth/login")
    .send({ email: "admin@local.test", password: "adminpass" })
    .expect(200);
  adminToken = adminLogin.body.token;

  // login normal user to get token
  const userLogin = await request(app)
    .post("/api/auth/login")
    .send({ email: "user@local.test", password: "userpass" })
    .expect(200);
  userToken = userLogin.body.token;
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Sweets CRUD & Inventory", () => {
  let createdId: number;

  test("Admin can create a sweet (POST /api/sweets)", async () => {
    const res = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Gulab Jamun",
        category: "Indian",
        price: 1.5,
        quantity: 100,
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("name", "Gulab Jamun");
    createdId = res.body.id;
  });

  test("Non-admin cannot create a sweet (403)", async () => {
    const res = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        name: "Jalebi",
        category: "Indian",
        price: 1.0,
        quantity: 50,
      });

    expect([401, 403]).toContain(res.status);
  });

  test("List sweets (GET /api/sweets) includes created sweet", async () => {
    const res = await request(app).get("/api/sweets").expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    const found = res.body.find((s: any) => s.id === createdId);
    expect(found).toBeTruthy();
    expect(found).toHaveProperty("name", "Gulab Jamun");
  });

  test("Get single sweet (GET /api/sweets/:id)", async () => {
    const res = await request(app).get(`/api/sweets/${createdId}`).expect(200);
    expect(res.body).toHaveProperty("id", createdId);
    expect(res.body).toHaveProperty("name", "Gulab Jamun");
  });

  test("Admin can update sweet (PUT /api/sweets/:id)", async () => {
    const res = await request(app)
      .put(`/api/sweets/${createdId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ price: 2.0, quantity: 80 });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("price", 2.0);
    expect(res.body).toHaveProperty("quantity", 80);
  });

  test("Non-admin cannot delete sweet (403)", async () => {
    const res = await request(app)
      .delete(`/api/sweets/${createdId}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect([401, 403]).toContain(res.status);
  });

  test("Admin can purchase (reduce quantity) (POST /api/sweets/:id/purchase)", async () => {
    const res = await request(app)
      .post(`/api/sweets/${createdId}/purchase`)
      .send({ quantity: 5 });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("quantity");
    expect(res.body.quantity).toBe(75); // previously 80 -> 75
  });

  test("Cannot purchase more than available (400)", async () => {
    const res = await request(app)
      .post(`/api/sweets/${createdId}/purchase`)
      .send({ quantity: 1000 });

    expect(res.status).toBe(400);
  });

  test("Admin can restock (POST /api/sweets/:id/restock)", async () => {
    const res = await request(app)
      .post(`/api/sweets/${createdId}/restock`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ quantity: 25 });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("quantity");
    expect(res.body.quantity).toBe(100); // 75 + 25
  });

  test("Admin can delete sweet (DELETE /api/sweets/:id)", async () => {
    const res = await request(app)
      .delete(`/api/sweets/${createdId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(204);
  });

  test("GET deleted sweet returns 404", async () => {
    const res = await request(app).get(`/api/sweets/${createdId}`);
    expect(res.status).toBe(404);
  });
});
