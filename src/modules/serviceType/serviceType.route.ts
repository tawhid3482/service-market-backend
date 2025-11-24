import { Router } from "express";
import { auth } from "../../middlewares/authMiddleware";
import { validateRequest } from "../../middlewares/validateRequest";
import { ServiceTypeController } from "./serviceType.controller";

const router = Router();

router.post("/create", ServiceTypeController.createServiceType);

router.get("/", ServiceTypeController.getAllServiceType);

router.get("/:id", ServiceTypeController.getSingleServiceType);
router.delete("/delete/:id", ServiceTypeController.deleteServiceType);
router.patch("/update/:id", ServiceTypeController.updateServiceType);

export const ServicesTypeRoutes = router;
