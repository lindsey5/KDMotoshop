import { Router } from "express";
import { create_new_admin, get_admin } from "../controllers/adminController";
import { adminRequireAuth } from "../middlewares/authMiddleware";

const router = Router();

router.post('/', create_new_admin);
router.get('/', adminRequireAuth, get_admin);

export default router;