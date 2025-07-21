import { Router } from "express";
import { create_review, get_item_review, get_product_reviews } from "../controllers/reviewController";
import { customerRequireAuth } from "../middlewares/authMiddleware";
const router = Router();

router.post('/', customerRequireAuth, create_review);
router.get('/product/:id', get_product_reviews);
router.get('/item/:id', get_item_review);

export default router;