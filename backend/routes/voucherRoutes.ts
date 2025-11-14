import { Router } from "express";
import { adminRequireAuth, customerRequireAuth } from "../middlewares/authMiddleware";
import { checkIfVoucherValid, createVoucher, getVouchers } from "../controllers/voucherController";

const router = Router();

router.post('/', adminRequireAuth, createVoucher);
router.get('/', adminRequireAuth, getVouchers);
router.get('/is-valid', customerRequireAuth, checkIfVoucherValid);

const voucherRoutes = router;

export default voucherRoutes;