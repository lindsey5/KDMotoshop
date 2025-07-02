import { Router } from "express";
import { create_product, get_product_by_id, get_product_by_id_with_reserved, get_products, get_top_products, update_product } from "../controllers/productController";
import { adminRequireAuth } from "../middlewares/authMiddleware";

const router = Router();

router.post('/', adminRequireAuth, create_product);
router.get('/', get_products);
router.get('/reserved', get_products);
router.get('/top', get_top_products);
router.get('/:id/reserved', get_product_by_id_with_reserved);
router.get('/:id', get_product_by_id);
router.put('/:id', update_product);

export default router;