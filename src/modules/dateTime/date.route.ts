import { Router } from "express";
import { auth } from "../../middlewares/authMiddleware";
import { validateRequest } from "../../middlewares/validateRequest";
import { DateTimeController } from "./dateTime.controller";


const router = Router();

router.post(
  "/create",
  DateTimeController.createDateTime
);

router.get("/", DateTimeController.getAllDateTime);
router.get("/:id", DateTimeController.getSingleDateTime);
router.delete("/delete/:id", DateTimeController.deleteDateTime);
router.patch("/update/:id", DateTimeController.updateDateTime);

export const DateTimeRoutes = router;
