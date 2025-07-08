import { Router } from "express";
import { customerRequireAuth } from "../middlewares/authMiddleware";
import { createPaymentCheckout } from "../controllers/paymentController";

const router = Router();

router.post('/', createPaymentCheckout);

export default router;