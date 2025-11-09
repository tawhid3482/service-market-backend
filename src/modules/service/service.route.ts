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

export const ServicesRoutes = router;
