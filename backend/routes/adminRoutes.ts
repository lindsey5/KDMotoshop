import { Router } from "express";
import { create_new_admin, get_admin, get_all_admins, update_admin, update_admin_profile } from "../controllers/adminController";
import { adminRequireAuth } from "../middlewares/authMiddleware";

const router = Router();

router.post('/', adminRequireAuth, create_new_admin);
router.get('/', adminRequireAuth, get_admin);
router.get('/all', adminRequireAuth, get_all_admins);
router.put('/profile', adminRequireAuth, update_admin_profile);
router.put('/', adminRequireAuth, update_admin);

export default router;