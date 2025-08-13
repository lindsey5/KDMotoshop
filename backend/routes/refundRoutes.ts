import { Router } from "express";
import { customerRequireAuth } from "../middlewares/authMiddleware";
import { createRefundRequest } from "../controllers/refundController";

const router = Router();

router.post('/', customerRequireAuth, createRefundRequest);

const refundRoutes = router;

export default refundRoutes;