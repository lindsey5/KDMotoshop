import { Router } from "express";
import { getItemToRefund } from "../controllers/refundController";

const router = Router();

router.get('/:id/items-to-refund', getItemToRefund);

const refundRoutes = router;

export default refundRoutes;