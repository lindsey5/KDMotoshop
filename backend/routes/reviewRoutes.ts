import { Router } from "express";
import { create_review, get_product_reviews } from "../controllers/reviewController";
import { customerRequireAuth } from "../middlewares/authMiddleware";
const router = Router();

router.post('/', customerRequireAuth, create_review);
router.get('/product/:id', get_product_reviews);

export default router;