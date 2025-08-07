import { Router } from "express";
import { adminLogin, customerLogin, logout, sendSignupEmailVerification, signinWithGoogle, signupCustomer } from "../controllers/authController";
import rateLimit from 'express-rate-limit';

const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  message: 'Too many attempts, please try again later.',
});

const router = Router();

router.post('/login', authLimiter, customerLogin)
router.post('/google/login', authLimiter, signinWithGoogle)
router.post('/admin/login', authLimiter, adminLogin);
router.post('/logout', authLimiter, logout)
router.post('/signup', authLimiter, signupCustomer)
router.post('/signup/verification', authLimiter, sendSignupEmailVerification);

export default router;