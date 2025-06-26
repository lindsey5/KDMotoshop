import { Router } from "express";
import { adminRequireAuth } from "../middlewares/authMiddleware";
import { get_monthly_sales } from "../controllers/salesController";

const router = Router();

router.get('/monthly', adminRequireAuth, get_monthly_sales)  

export default router;