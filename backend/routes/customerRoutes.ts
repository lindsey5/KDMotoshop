import { Router } from "express";
import { getCustomerById, getCustomers, updateCustomer } from "../controllers/customerController";
import { adminRequireAuth, customerRequireAuth } from "../middlewares/authMiddleware";
const router = Router();

router.get('/', customerRequireAuth, getCustomerById);
router.put('/', customerRequireAuth, updateCustomer);
router.get('/all', adminRequireAuth, getCustomers);

export default router;