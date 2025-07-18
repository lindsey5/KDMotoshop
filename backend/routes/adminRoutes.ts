import { Router } from "express";
import { create_new_admin, get_admin, update_admin } from "../controllers/adminController";
import { adminRequireAuth } from "../middlewares/authMiddleware";

const router = Router();

router.post('/', create_new_admin);
router.get('/', adminRequireAuth, get_admin);
router.put('/', adminRequireAuth, update_admin);

export default router;