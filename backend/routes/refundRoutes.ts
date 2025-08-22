import { Router } from "express";
import { adminRequireAuth, customerRequireAuth } from "../middlewares/authMiddleware";
import { createRefundRequest, getRefundRequests, updateRefundRequest } from "../controllers/refundController";

const router = Router();

router.post('/', customerRequireAuth, createRefundRequest);
router.get('/', adminRequireAuth, getRefundRequests);
router.put('/:id', adminRequireAuth, updateRefundRequest);

const refundRoutes = router;

export default refundRoutes;