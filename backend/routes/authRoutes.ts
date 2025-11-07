import { Router } from "express";
import { adminLogin, customerLogin, getUser, logout, sendSignupEmailVerification, signinWithGoogle, signupCustomer } from "../controllers/authController";
import rateLimit from 'express-rate-limit';
import { tokenRequire } from "../middlewares/authMiddleware";

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many attempts, please try again later.',
});

const router = Router();

router.post('/login', customerLogin)
router.post('/google/login', signinWithGoogle)
router.post('/admin/login', authLimiter, adminLogin);
router.post('/logout', logout)
router.post('/signup', signupCustomer)
router.post('/signup/verification', sendSignupEmailVerification);
router.get('/user', tokenRequire, getUser)

export default router;