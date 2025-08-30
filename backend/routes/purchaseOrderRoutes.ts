import { Router } from "express";
import { adminRequireAuth } from "../middlewares/authMiddleware";
import { createPurchaseOrder, getPurchaseOrders } from "../controllers/purchaseOrderController";

const router = Router();

router.post('/', adminRequireAuth, createPurchaseOrder);
router.get('/', adminRequireAuth, getPurchaseOrders)

const purchaseOrderRoutes = router;

export default purchaseOrderRoutes;