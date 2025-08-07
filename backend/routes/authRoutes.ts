import { Router } from "express";
import { adminLogin, logout, sendSignupEmailVerification, signinWithGoogle, signupCustomer } from "../controllers/authController";

const router = Router();

router.post('/login', signupCustomer)
router.post('/google/login', signinWithGoogle)
router.post('/admin/login', adminLogin);
router.post('/logout', logout)
router.post('/signup', signupCustomer)
router.post('/signup/verification', sendSignupEmailVerification);

export default router;