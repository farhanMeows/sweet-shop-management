// backend/prisma/seed.ts
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const categories = ["Indian", "Dessert", "Chocolate", "Bakery", "Regional"];

function rand(min: number, max: number) {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@local.test";
  const adminPassword = process.env.ADMIN_PASSWORD || "adminpass";
  const hashed = await bcrypt.hash(adminPassword, 10);

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });
  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashed,
        name: "Administrator",
        role: Role.ADMIN,
      },
    });
    console.log("Admin user created:", adminEmail);
  } else {
    console.log("Admin exists, skipping creation:", adminEmail);
  }

  // create 50 sweets if not already present
  const existing = await prisma.sweet.count();
  if (existing >= 50) {
    console.log(
      "Sweets already seeded (count >= 50). Skipping sweets creation."
    );
    return;
  }

  const sweetsData = [];
  for (let i = 1; i <= 50; i++) {
    const cat = categories[(i - 1) % categories.length];
    sweetsData.push({
      name: `${cat} Sweet ${i}`,
      category: cat,
      price: Number(rand(0.5, 10).toFixed(2)),
      quantity: Math.floor(rand(5, 200)),
    });
  }

  // create in batches
  while (sweetsData.length) {
    const chunk = sweetsData.splice(0, 20);
    await prisma.sweet.createMany({ data: chunk });
  }

  console.log("Seeded 50 sweets across categories:", categories.join(", "));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
