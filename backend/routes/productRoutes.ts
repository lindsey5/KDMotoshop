import { Router } from "express";
import { create_product, get_low_stock_products, get_product_by_id, get_products, get_top_products, update_product } from "../controllers/productController";
import { adminRequireAuth } from "../middlewares/authMiddleware";

const router = Router();

router.post('/', adminRequireAuth, create_product);
router.get('/', get_products);
router.get('/top', get_top_products);
router.get('/low-stock', adminRequireAuth, get_low_stock_products);
router.get('/:id', get_product_by_id);
router.put('/:id', adminRequireAuth, update_product);

export default router;