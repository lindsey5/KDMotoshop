import { Router } from "express";
import { create_product, get_product_by_id, get_products, get_top_products, update_product } from "../controllers/productController";
import { adminRequireAuth } from "../middlewares/authMiddleware";

const router = Router();

router.post('/', adminRequireAuth, create_product);
router.get('/', adminRequireAuth, get_products);
router.get('/with-reserved', get_products);
router.get('/top', get_top_products);
router.get('/:id', get_product_by_id);
router.put('/:id', update_product);

export default router;