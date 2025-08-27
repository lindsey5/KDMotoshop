import { Router } from "express";
import { adminRequireAuth, customerRequireAuth } from "../middlewares/authMiddleware";
import { createRefundRequest, getRefundRequests, updateRefundRequest } from "../controllers/refundController";
import multer from "multer";
const upload = multer({ dest: "uploads/" }); 

const router = Router();

router.post('/', upload.single("video"), customerRequireAuth, createRefundRequest);
router.get('/', adminRequireAuth, getRefundRequests);
router.put('/:id', adminRequireAuth, updateRefundRequest);

const refundRoutes = router;

export default refundRoutes;