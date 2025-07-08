import { Router } from "express";
import { getCart } from "../controllers/cartController";
import { customerRequireAuth } from "../middlewares/authMiddleware";

const router = Router();

router.get('/', customerRequireAuth, getCart);

export default router;