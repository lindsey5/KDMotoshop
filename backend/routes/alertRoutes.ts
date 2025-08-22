import { Router } from "express";
import { adminRequireAuth } from "../middlewares/authMiddleware";
import { getLowStockAlerts } from "../controllers/alertController";
const router = Router();

router.get('/', adminRequireAuth, getLowStockAlerts);

export default router;