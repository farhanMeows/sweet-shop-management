import request from "supertest";
import { PrismaClient, Role } from "@prisma/client";
import { startServer } from "../src/server";

const prisma = new PrismaClient();
let app: any;
let adminToken: string;

beforeAll(async () => {
  app = await startServer();

  // clean tables
  await prisma.sweet.deleteMany({});
  await prisma.user.deleteMany({});

  // 1) Register a user via the API (use auth routes to ensure same password hashing path)
  const email = "admin-test@example.com";
  const password = "strongpass123";
  await request(app).post("/api/auth/register").send({
    name: "Admin Test",
    email,
    password,
  });

  // 2) Promote that user to ADMIN directly in DB (tests run in isolated DB)
  const u = await prisma.user.findUnique({ where: { email } });
  if (!u) throw new Error("Failed to create test admin user");
  await prisma.user.update({
    where: { id: u.id },
    data: { role: Role.ADMIN },
  });

  // 3) Login to get JWT token
  const login = await request(app).post("/api/auth/login").send({
    email,
    password,
  });
  adminToken = login.body.token;
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Sweets CRUD & Inventory", () => {
  let createdId: number;

  it("create a sweet (POST /api/sweets) as admin", async () => {
    const res = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Gulab Jamun",
        category: "Indian",
        price: 1.5,
        quantity: 100,
      })
      .expect(201);

    // res.body should be the created object
    const obj = Array.isArray(res.body) ? res.body[0] : res.body;
    createdId = obj.id;
    expect(obj).toHaveProperty("id");
  });

  it("List sweets (GET /api/sweets) includes created sweet", async () => {
    const res = await request(app).get("/api/sweets").expect(200);
    const payload = res.body;
    const items = Array.isArray(payload) ? payload : payload.data;
    expect(Array.isArray(items)).toBe(true);
    const found = items.find((s: any) => s.id === createdId);
    expect(found).toBeTruthy();
    expect(found).toHaveProperty("name", "Gulab Jamun");
  });

  it("Get / Update / Delete flow", async () => {
    // GET single
    const g = await request(app).get(`/api/sweets/${createdId}`).expect(200);
    expect(g.body).toHaveProperty("id", createdId);

    // UPDATE (admin)
    await request(app)
      .put(`/api/sweets/${createdId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ price: 2.0 })
      .expect(200);

    // PURCHASE (public)
    await request(app)
      .post(`/api/sweets/${createdId}/purchase`)
      .send({ quantity: 1 })
      .expect(200);

    // RESTOCK (admin)
    await request(app)
      .post(`/api/sweets/${createdId}/restock`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ quantity: 5 })
      .expect(200);

    // DELETE (admin)
    await request(app)
      .delete(`/api/sweets/${createdId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(204);
  });
});
