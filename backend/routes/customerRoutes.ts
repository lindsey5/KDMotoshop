import { Router } from "express";
import { changeCustomerPassword, getCustomerById, getCustomers, totalCustomers, updateCustomer, updateCustomerStatus } from "../controllers/customerController";
import { adminRequireAuth, customerRequireAuth } from "../middlewares/authMiddleware";
const router = Router();

router.get('/', customerRequireAuth, getCustomerById);
router.get('/total', adminRequireAuth, totalCustomers);
router.put('/', customerRequireAuth, updateCustomer);
router.put('/password', customerRequireAuth, changeCustomerPassword);
router.put('/:id/status', adminRequireAuth, updateCustomerStatus);
router.get('/all', adminRequireAuth, getCustomers);

export default router;