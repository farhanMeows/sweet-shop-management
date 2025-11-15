// backend/src/routes/me.ts
import { Router } from "express";
import { authRequired } from "../middleware/authMiddleware";

const router = Router();

router.get("/me", authRequired, (req: any, res) => {
  return res.json({ user: req.user });
});

export default router;
