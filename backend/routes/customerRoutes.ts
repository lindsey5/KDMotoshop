import { Router } from "express";
import { changeCustomerPassword, getCustomerById, getCustomers, updateCustomer } from "../controllers/customerController";
import { adminRequireAuth, customerRequireAuth } from "../middlewares/authMiddleware";
const router = Router();

router.get('/', customerRequireAuth, getCustomerById);
router.put('/', customerRequireAuth, updateCustomer);
router.put('/password', customerRequireAuth, changeCustomerPassword);
router.get('/all', adminRequireAuth, getCustomers);

export default router;