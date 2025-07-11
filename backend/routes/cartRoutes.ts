import { Router } from "express";
import { create_new_item, delete_cart_item, getCart, updateCart } from "../controllers/cartController";
import { customerRequireAuth } from "../middlewares/authMiddleware";

const router = Router();

router.post('/', customerRequireAuth, create_new_item);
router.get('/', customerRequireAuth, getCart);
router.put('/:id', customerRequireAuth, updateCart);
router.delete('/:id', customerRequireAuth, delete_cart_item);

export default router;