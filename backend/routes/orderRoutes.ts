import { cancel_order, create_customer_order, create_order, get_customer_orders, get_order_by_id, get_orders, get_orders_statistics, update_order } from "../controllers/orderController";
import { Router } from "express";
import { adminRequireAuth, customerRequireAuth } from "../middlewares/authMiddleware";

const router = Router();

router.post('/', adminRequireAuth, create_order);
router.post('/customer', customerRequireAuth, create_customer_order);
router.get('/customer', customerRequireAuth, get_customer_orders);
router.put('/customer/:id/cancel', customerRequireAuth, cancel_order);
router.get('/', adminRequireAuth,  get_orders);
router.get('/statistics', adminRequireAuth, get_orders_statistics); 
router.get('/:id', get_order_by_id);
router.put('/:id', adminRequireAuth, update_order);

export default router;