import { Router } from "express";

import { adminRequireAuth } from "../middlewares/authMiddleware";
import { get_activity_logs } from "../controllers/activityLog.Controller";

const router = Router();

router.get('/', adminRequireAuth, get_activity_logs);

export default router;