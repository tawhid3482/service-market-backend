import { Request, Response, NextFunction } from "express";
import { bookingServices } from "./bookings.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import AppError from "../../helpers/AppError";

export const bookingController = {
  createBooking: catchAsync(async (req: Request, res: Response) => {
    const traineeId = req.user!.id;
    const { classId } = req.body;

    const booking = await bookingServices.createBooking(traineeId, classId);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Class booked successfully",
      data: [booking],
    });
  }),

  cancelBooking: catchAsync(async (req: Request, res: Response) => {
    const traineeId = req.user!.id;
    const { bookingId } = req.params;
    if (!bookingId) {
      throw new AppError(404, "Booking ID is required");
    }

    const cancelled = await bookingServices.cancelBooking(bookingId, traineeId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Booking cancelled successfully",
      data: [cancelled],
    });
  }),

  getMyBookings: catchAsync(async (req: Request, res: Response) => {
    const traineeId = req.user!.id;
    const bookings = await bookingServices.getBookingsByTrainee(traineeId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Your bookings fetched successfully",
      data: bookings,
    });
  }),
};
