import { Router } from "express";
import { adminRequireAuth } from "../middlewares/authMiddleware";
import { get_daily_sales, get_monthly_sales, get_product_quantity_sold, get_sales_statistics } from "../controllers/salesController";

const router = Router();

router.get('/monthly', adminRequireAuth, get_monthly_sales)  
router.get('/daily', adminRequireAuth, get_daily_sales)  
router.get('/statistics', adminRequireAuth, get_sales_statistics)
router.get('/product-quantity-sold', adminRequireAuth, get_product_quantity_sold)

export default router;