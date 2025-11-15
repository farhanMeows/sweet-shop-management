// backend/src/controllers/sweetController.ts
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middleware/authMiddleware";

const prisma = new PrismaClient();

function isAdmin(req: AuthRequest) {
  return req.user && req.user.role === "ADMIN";
}

export async function createSweet(req: AuthRequest, res: Response) {
  if (!isAdmin(req)) return res.status(403).json({ error: "Admin required" });

  const { name, category, price, quantity } = req.body;
  if (!name || price == null || quantity == null) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const sweet = await prisma.sweet.create({
    data: {
      name,
      category: category ?? "",
      price: Number(price),
      quantity: Number(quantity),
    },
  });

  return res.status(201).json(sweet);
}

export async function listSweets(_req: Request, res: Response) {
  const sweets = await prisma.sweet.findMany({ orderBy: { id: "asc" } });
  return res.json(sweets);
}

export async function getSweet(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid id" });

  const sweet = await prisma.sweet.findUnique({ where: { id } });
  if (!sweet) return res.status(404).json({ error: "Not found" });
  return res.json(sweet);
}

export async function updateSweet(req: AuthRequest, res: Response) {
  if (!isAdmin(req)) return res.status(403).json({ error: "Admin required" });

  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid id" });

  const payload: any = {};
  if (req.body.name) payload.name = req.body.name;
  if (req.body.category) payload.category = req.body.category;
  if (req.body.price != null) payload.price = Number(req.body.price);
  if (req.body.quantity != null) payload.quantity = Number(req.body.quantity);

  try {
    const updated = await prisma.sweet.update({
      where: { id },
      data: payload,
    });
    return res.json(updated);
  } catch (err) {
    return res.status(404).json({ error: "Not found" });
  }
}

export async function deleteSweet(req: AuthRequest, res: Response) {
  if (!isAdmin(req)) return res.status(403).json({ error: "Admin required" });

  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid id" });

  try {
    await prisma.sweet.delete({ where: { id } });
    return res.status(204).send();
  } catch (err) {
    return res.status(404).json({ error: "Not found" });
  }
}

export async function purchaseSweet(req: Request, res: Response) {
  const id = Number(req.params.id);
  const q = Number(req.body.quantity ?? 1);
  if (Number.isNaN(id) || Number.isNaN(q) || q <= 0)
    return res.status(400).json({ error: "Invalid input" });

  const sweet = await prisma.sweet.findUnique({ where: { id } });
  if (!sweet) return res.status(404).json({ error: "Not found" });

  if (sweet.quantity < q)
    return res.status(400).json({ error: "Not enough stock" });

  const updated = await prisma.sweet.update({
    where: { id },
    data: { quantity: sweet.quantity - q },
  });

  return res.json(updated);
}

export async function restockSweet(req: AuthRequest, res: Response) {
  if (!isAdmin(req)) return res.status(403).json({ error: "Admin required" });

  const id = Number(req.params.id);
  const q = Number(req.body.quantity ?? 0);
  if (Number.isNaN(id) || Number.isNaN(q) || q <= 0)
    return res.status(400).json({ error: "Invalid input" });

  const sweet = await prisma.sweet.findUnique({ where: { id } });
  if (!sweet) return res.status(404).json({ error: "Not found" });

  const updated = await prisma.sweet.update({
    where: { id },
    data: { quantity: sweet.quantity + q },
  });

  return res.json(updated);
}
