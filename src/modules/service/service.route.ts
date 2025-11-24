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
router.delete("/delete/:id", ServiceController.deleteService);
router.patch("/update/:id", ServiceController.updateService);

export const ServicesRoutes = router;
