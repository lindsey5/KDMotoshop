import { Router } from "express";
import { adminLogin, customerLogin, forgotPassword, getUser, logout, resetPassword, sendSignupEmailVerification, signinWithGoogle, signupCustomer } from "../controllers/authController";
import { tokenRequire } from "../middlewares/authMiddleware";
import rateLimit from "express-rate-limit";

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many attempts. Please wait 15 minutes.",
  },
  keyGenerator: function (req: any) {
      return req.headers["x-forwarded-for"] || req.connection.remoteAddress; 
  }
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