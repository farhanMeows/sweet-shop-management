// backend/prisma/seed.ts
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const pw = process.env.ADMIN_PASSWORD || "admin123";
  const email = process.env.ADMIN_EMAIL || "admin@example.com";

  const hashed = await bcrypt.hash(pw, 10);
  const exist = await prisma.user.findUnique({ where: { email } });
  if (!exist) {
    await prisma.user.create({
      data: {
        email,
        password: hashed,
        name: "Administrator",
        role: Role.ADMIN,
      },
    });
    console.log("Admin user created: ", email);
  } else {
    console.log("Admin user exists, skipping creation.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
