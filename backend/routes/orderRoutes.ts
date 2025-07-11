import { create_customer_order, create_order, get_order_by_id, get_orders, get_orders_statistics, update_order } from "../controllers/orderController";
import { Router } from "express";
import { adminRequireAuth, customerRequireAuth, userRequireAuth } from "../middlewares/authMiddleware";

const router = Router();

router.post('/', userRequireAuth, create_order);
router.post('/customer', customerRequireAuth, create_customer_order);
router.get('/', adminRequireAuth,  get_orders);
router.get('/statistics', adminRequireAuth, get_orders_statistics); 
router.get('/:id', adminRequireAuth,  get_order_by_id);
router.put('/:id', userRequireAuth, update_order);

export default router;