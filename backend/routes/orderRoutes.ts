import { create_order, get_orders, get_orders_statistics } from "../controllers/orderController";
import { Router } from "express";
import { adminRequireAuth, userRequireAuth } from "../middlewares/authMiddleware";

const router = Router();

router.post('/', userRequireAuth, create_order);
router.get('/', adminRequireAuth,  get_orders);
router.get('/statistics', adminRequireAuth, get_orders_statistics); 

export default router;