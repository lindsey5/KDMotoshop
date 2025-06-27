import { Router } from "express";
import { adminRequireAuth } from "../middlewares/authMiddleware";
import { get_monthly_sales, get_sales_statistics } from "../controllers/salesController";

const router = Router();

router.get('/monthly', adminRequireAuth, get_monthly_sales)  
router.get('/statistics', adminRequireAuth, get_sales_statistics)

export default router;