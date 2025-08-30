import { Router } from "express";
import { createSupplier, getSuppliers, updateSupplier } from "../controllers/supplierController";
import { adminRequireAuth } from "../middlewares/authMiddleware";

const router = Router();

router.post('/', adminRequireAuth, createSupplier);
router.get('/', adminRequireAuth, getSuppliers);
router.put('/:id', adminRequireAuth, updateSupplier);

const supplierRoutes = router;

export default supplierRoutes;