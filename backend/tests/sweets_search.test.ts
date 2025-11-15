// backend/tests/sweets_search.test.ts
import request from "supertest";
import { PrismaClient } from "@prisma/client";
import { startServer } from "../src/server";

const prisma = new PrismaClient();
let app: any;

beforeAll(async () => {
  app = await startServer();
  // reset tables
  await prisma.sweet.deleteMany({});
  // seed sample sweets
  await prisma.sweet.createMany({
    data: [
      { name: "Gulab Jamun", category: "Indian", price: 1.5, quantity: 100 },
      { name: "Jalebi", category: "Indian", price: 1.0, quantity: 50 },
      { name: "Chocolate Cake", category: "Dessert", price: 5.0, quantity: 20 },
      { name: "Donut", category: "Dessert", price: 2.0, quantity: 30 },
      { name: "Ladoo", category: "Indian", price: 1.2, quantity: 40 },
    ],
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("GET /api/sweets/search", () => {
  it("search by name substring", async () => {
    const res = await request(app)
      .get("/api/sweets/search")
      .query({ name: "Gulab" })
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    expect(res.body[0].name).toContain("Gulab");
  });

  it("search by category", async () => {
    const res = await request(app)
      .get("/api/sweets/search")
      .query({ category: "Dessert" })
      .expect(200);
    expect(
      res.body.every((s: any) => s.category.toLowerCase().includes("dessert"))
    ).toBe(true);
  });

  it("search by price range", async () => {
    const res = await request(app)
      .get("/api/sweets/search")
      .query({ minPrice: "1.0", maxPrice: "2.0" })
      .expect(200);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    expect(res.body.every((s: any) => s.price >= 1.0 && s.price <= 2.0)).toBe(
      true
    );
  });

  it("general q searches name or category", async () => {
    const res = await request(app)
      .get("/api/sweets/search")
      .query({ q: "chocolate" })
      .expect(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name.toLowerCase()).toContain("chocolate");
  });
});
