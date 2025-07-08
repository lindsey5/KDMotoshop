import { Router } from "express";
import { login, signinWithGoogle, signupCustomer } from "../controllers/authController";

const router = Router();

router.post('/login', signupCustomer)
router.post('/google/login', signinWithGoogle)
router.post('/admin/login', login);

export default router;