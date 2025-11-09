import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { registerUserSchema } from "./user.validation";
import { UserController } from "./user.controller";
import { auth } from "../../middlewares/authMiddleware";
const router = Router();

router.post(
  "/register",
  validateRequest(registerUserSchema),
  UserController.createUser
);

router.get("/me", auth("ADMIN", "TRAINEE", "TRAINER"), UserController.getMe);

export const UserRoutes = router;
