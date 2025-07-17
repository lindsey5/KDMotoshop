import { Router } from "express";
import { adminRequireAuth, customerRequireAuth } from "../middlewares/authMiddleware";
import { get_admin_notifications, get_customer_notifications, update_admin_notification, update_customer_notification } from "../controllers/notificationController";

const router = Router();

router.get('/admin', adminRequireAuth, get_admin_notifications);
router.put('/:id/admin', adminRequireAuth, update_admin_notification);
router.get('/customer', customerRequireAuth, get_customer_notifications);
router.put('/:id/customer', customerRequireAuth, update_customer_notification);

export default router;