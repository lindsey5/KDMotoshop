import { Router } from "express";
import rateLimit from "express-rate-limit";
import { adminLogin, customerLogin, forgotPassword, getUser, logout, resetPassword, sendSignupEmailVerification, signinWithGoogle, signupCustomer } from "../controllers/authController";
import { tokenRequire } from "../middlewares/authMiddleware";

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many attempts. Please wait 15 minutes.",
  },
  keyGenerator: (req: any) => {
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress || req.ip;
    return typeof ip === "string" ? ip.split(",")[0].trim() : "unknown";
  },
});

const router = Router();

router.post('/login', customerLogin);
router.post('/google/login', signinWithGoogle);
router.post('/admin/login', authLimiter, adminLogin);
router.post('/logout', logout);
router.post('/signup', signupCustomer);
router.post('/signup/verification', sendSignupEmailVerification);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/user', tokenRequire, getUser);

export default router;
