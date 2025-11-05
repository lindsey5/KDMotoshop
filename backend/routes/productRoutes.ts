import { Router } from "express";
import { create_product, delete_product, get_inventory_status, get_product_by_id, get_products, get_published_product_by_id, get_top_products, update_product } from "../controllers/productController";
import { adminRequireAuth } from "../middlewares/authMiddleware";

const router = Router();

router.post('/', adminRequireAuth, create_product);
router.get('/', get_products);
router.get('/top', get_top_products);
router.get('/inventory-status', adminRequireAuth, get_inventory_status);
router.get('/published/:id', get_published_product_by_id);
router.get('/:id', get_product_by_id);
router.put('/:id', adminRequireAuth, update_product);
router.delete('/:id', adminRequireAuth, delete_product);

export default router;