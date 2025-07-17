import { Router } from "express";
import { customerRequireAuth } from "../middlewares/authMiddleware";
import { get_customer_notifications, update_customer_notification } from "../controllers/notificationController";

const router = Router();

router.get('/customer', customerRequireAuth, get_customer_notifications);
router.put('/:id/customer', customerRequireAuth, update_customer_notification);

export default router;