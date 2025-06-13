import { Router } from "express";
import { create_new_user, get_user } from "../controllers/userController";
import { adminRequireAuth, userRequireAuth } from "../middlewares/authMiddleware";

const router = Router();

router.post('/', adminRequireAuth, create_new_user);
router.get('/', userRequireAuth, get_user);

export default router;