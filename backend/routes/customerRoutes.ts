import { Router } from "express";
import { getCustomerById, updateCustomer } from "../controllers/customerController";
import { customerRequireAuth } from "../middlewares/authMiddleware";
const router = Router();

router.get('/', customerRequireAuth, getCustomerById);
router.put('/', customerRequireAuth, updateCustomer);

export default router;