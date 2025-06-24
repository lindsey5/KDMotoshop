import { create_order, get_orders } from "../controllers/orderController";
import { Router } from "express";
import { adminRequireAuth, userRequireAuth } from "../middlewares/authMiddleware";

const router = Router();

router.post('/', userRequireAuth, create_order);
router.get('/', adminRequireAuth,  get_orders);

export default router;