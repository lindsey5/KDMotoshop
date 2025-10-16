import { Router } from "express";
import { adminRequireAuth } from "../middlewares/authMiddleware";
import { get_predicted_items, get_predicted_sales } from "../controllers/aiController";

const router = Router();

router.get('/api/predict', adminRequireAuth, get_predicted_sales);
router.get('/api/predict/items', adminRequireAuth, get_predicted_items);

const aiRoutes = router;
export default aiRoutes;