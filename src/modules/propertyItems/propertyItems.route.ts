import { Router } from "express";
import { auth } from "../../middlewares/authMiddleware";
import { validateRequest } from "../../middlewares/validateRequest";
import { PropertyItemsController } from "./propertyItems.controller";


const router = Router();

router.post(
  "/create",
  PropertyItemsController.createPropertyItems
);

router.get("/", PropertyItemsController.getAllPropertyItems);
router.get("/:id", PropertyItemsController.getSinglePropertyItems);

export const PropertyItemsRoutes = router;
