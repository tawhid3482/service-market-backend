import { Router } from "express";
import { auth } from "../../middlewares/authMiddleware";
import { validateRequest } from "../../middlewares/validateRequest";
import { PropertyTypeController } from "./propertyType.controller";


const router = Router();

router.post(
  "/create",
  PropertyTypeController.createPropertyType
);

router.get("/", PropertyTypeController.getAllPropertyType);

export const PropertyTypeRoutes = router;
