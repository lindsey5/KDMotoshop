import { Router } from "express";
import { adminRequireAuth } from "../middlewares/authMiddleware";
import { createPurchaseOrder, getMonthlyExpenses, getPurchaseOrderById, getPurchaseOrders, updatePurchaseOrder } from "../controllers/purchaseOrderController";

const router = Router();

router.post('/', adminRequireAuth, createPurchaseOrder);
router.get('/', adminRequireAuth, getPurchaseOrders);
router.get('/monthly-expenses', getMonthlyExpenses);
router.get('/:id', adminRequireAuth, getPurchaseOrderById);
router.put('/:id', adminRequireAuth, updatePurchaseOrder);

const purchaseOrderRoutes = router;

export default purchaseOrderRoutes;