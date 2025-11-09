import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { classServices } from "./schedule.service";
import AppError from "../../helpers/AppError";

export const classController = {
  createClassSchedule: catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const id = req.user!.id;
      const schedule = await classServices.createClassSchedule(id, req.body);

      sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Class schedule created successfully",
        data: [schedule],
      });
    }
  ),

  getAllSchedules: catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const schedules = await classServices.getAllSchedules();

      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Schedules fetched successfully",
        data: schedules,
      });
    }
  ),

  getScheduleById: catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      if (!id) {
        throw new AppError(404, "Id is required");
      }
      const schedule = await classServices.getScheduleById(id);

      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Schedule fetched successfully",
        data: [schedule],
      });
    }
  ),
};
