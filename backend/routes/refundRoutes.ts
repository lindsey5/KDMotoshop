import { Router } from "express";
import { adminRequireAuth, customerRequireAuth } from "../middlewares/authMiddleware";
import { createRefundRequest, getRefundRequests } from "../controllers/refundController";

const router = Router();

router.post('/', customerRequireAuth, createRefundRequest);
router.get('/', adminRequireAuth, getRefundRequests);

const refundRoutes = router;

export default refundRoutes;