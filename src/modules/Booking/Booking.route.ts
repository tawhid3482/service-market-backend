import { Router } from "express";
import { auth } from "../../middlewares/authMiddleware";
import { validateRequest } from "../../middlewares/validateRequest";
import { BookingController } from "./Booking.controller";
import { BookingSchema } from "./Booking.validation";


const router = Router();

router.post(
  "/create",
validateRequest(BookingSchema),
 BookingController.createBooking
);

router.get("/", BookingController.getAllBooking);
// router.get("/:id", BookingController.getAllUserBooking);
router.get("/:id", BookingController.getSingleBooking);
router.patch("/:id", BookingController.updateBooking);
router.delete("/:id", BookingController.deleteBooking);

export const BookingsRoutes = router;
