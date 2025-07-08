import { Router } from "express";
import { getCustomerById } from "../controllers/customerController";
import { customerRequireAuth } from "../middlewares/authMiddleware";
const router = Router();

router.get('/', customerRequireAuth, getCustomerById);

export default router;