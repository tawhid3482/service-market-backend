import { Router } from "express";
import { auth } from "../../middlewares/authMiddleware";
import { validateRequest } from "../../middlewares/validateRequest";
import { createBookingSchema } from "./bookings.validation";
import { bookingController } from "./bookings.controller";

const router = Router();

// Trainee booking
router.post(
  "/",
  auth("TRAINEE"),
  validateRequest(createBookingSchema),
  bookingController.createBooking
);

router.patch(
  "/cancel/:bookingId",
  auth("TRAINEE"),
  bookingController.cancelBooking
);

router.get("/my", auth("TRAINEE"), bookingController.getMyBookings);

export const BookingsRoutes = router;
