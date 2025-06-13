import { Router } from "express";
import { adminRequireAuth } from "../middlewares/authMiddleware";
import { create_category, get_categories } from "../controllers/categoryController";

const router = Router();

router.post('/', adminRequireAuth, create_category);
router.get('/', get_categories);

export default router;