import { Router } from "express";
import { adminLogin, signinWithGoogle, signupCustomer } from "../controllers/authController";

const router = Router();

router.post('/login', signupCustomer)
router.post('/google/login', signinWithGoogle)
router.post('/admin/login', adminLogin);

export default router;