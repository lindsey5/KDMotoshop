import { Router } from "express";
import { adminRequireAuth } from "../middlewares/authMiddleware";
import { create_category, delete_category, get_categories, get_top_categories } from "../controllers/categoryController";

const router = Router();

router.post('/', adminRequireAuth, create_category);
router.get('/', get_categories);
router.get('/top', get_top_categories);
router.delete('/:id', adminRequireAuth, delete_category);

export default router;