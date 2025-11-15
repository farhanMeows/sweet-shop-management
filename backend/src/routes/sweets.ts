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
  searchSweets,
} from "../controllers/sweetController";
import { authRequired } from "../middleware/authMiddleware";

const router = Router();

router.get("/search", searchSweets);
router.post("/", authRequired, createSweet);
router.get("/", listSweets);
router.get("/:id", getSweet);
router.put("/:id", authRequired, updateSweet);
router.delete("/:id", authRequired, deleteSweet);
router.post("/:id/purchase", purchaseSweet);
router.post("/:id/restock", authRequired, restockSweet);

export default router;
