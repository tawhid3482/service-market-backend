import { Router } from "express";
import { auth } from "../../middlewares/authMiddleware";
import { validateRequest } from "../../middlewares/validateRequest";
import { ServiceTypeController } from "./serviceType.controller";


const router = Router();

router.post(
  "/create",
  ServiceTypeController.createServiceType
);

router.get("/", ServiceTypeController.getAllServiceType);

export const ServicesTypeRoutes = router;
