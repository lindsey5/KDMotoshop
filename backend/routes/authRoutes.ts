import { Router } from "express";
import { adminLogin, customerLogin, forgotPassword, getUser, logout, resetPassword, sendSignupEmailVerification, signinWithGoogle, signupCustomer } from "../controllers/authController";
import { tokenRequire } from "../middlewares/authMiddleware";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";

// Wrap ipKeyGenerator in a function that matches expected signature
const keyGen = (req: any, res: any) => {
  // req.ip is used by ipKeyGenerator
  return ipKeyGenerator(req.ip);
};

const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many attempts. Please wait 15 minutes.",
  },
  keyGenerator: keyGen,
});

const router = Router();

router.post('/login', authLimiter, customerLogin);
router.post('/google/login', authLimiter, signinWithGoogle);
router.post('/admin/login', authLimiter, adminLogin);
router.post('/logout', logout);
router.post('/signup', authLimiter, signupCustomer);
router.post('/signup/verification', authLimiter, sendSignupEmailVerification);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password/:token', authLimiter, resetPassword);
router.get('/user', tokenRequire, getUser);

export default router;