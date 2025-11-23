import { Router } from "express";
import { auth } from "../../middlewares/authMiddleware";
import { validateRequest } from "../../middlewares/validateRequest";
import { ServiceController } from "./service.controller";


const router = Router();

router.post(
  "/create",

  ServiceController.createService
);

router.get("/", ServiceController.getAllService);
router.get("/:id", ServiceController.getSingleService);
router.get("/:id", ServiceController.deleteService);
router.get("/:id", ServiceController.updateService);

export const ServicesRoutes = router;
