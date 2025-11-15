// backend/src/routes/sweets.ts
import { Router } from "express";
import {
  createSweet,
  listSweets,
  getSweet,
  updateSweet,
  deleteSweet,
  purchaseSweet,
  restockSweet,
} from "../controllers/sweetController";
import { authRequired } from "../middleware/authMiddleware";

const router = Router();

router.post("/", authRequired, createSweet); // admin required inside controller
router.get("/", listSweets);
router.get("/:id", getSweet);
router.put("/:id", authRequired, updateSweet); // admin required inside controller
router.delete("/:id", authRequired, deleteSweet); // admin required
router.post("/:id/purchase", purchaseSweet); // public purchase (no auth)
router.post("/:id/restock", authRequired, restockSweet); // admin only

export default router;
