import { Router } from "express";
import { auth } from "../../middlewares/authMiddleware";
import { validateRequest } from "../../middlewares/validateRequest";
import { createClassScheduleSchema } from "./schedule.validation";
import { classController } from "./schedule.controller";


const router = Router();

router.post(
  "/",
  auth("ADMIN"),
  validateRequest(createClassScheduleSchema),
  classController.createClassSchedule
);


router.get("/", auth("ADMIN", "TRAINER", "TRAINEE"), classController.getAllSchedules);

router.get("/:id", auth("ADMIN", "TRAINER", "TRAINEE"), classController.getScheduleById);

export const ScheduleRoutes = router;
