import { Router } from "express";
import { create_new_admin, get_admin, get_all_admins, update_admin } from "../controllers/adminController";
import { adminRequireAuth } from "../middlewares/authMiddleware";

const router = Router();

router.post('/', create_new_admin);
router.get('/', adminRequireAuth, get_admin);
router.get('/all', adminRequireAuth, get_all_admins);
router.put('/', adminRequireAuth, update_admin);

export default router;