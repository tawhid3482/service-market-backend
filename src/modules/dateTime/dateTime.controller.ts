import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { DateTimeService } from "./dateTime.service";

const createDateTime = catchAsync(async (req, res) => {
  const { startDate, endDate, timeSlots } = req.body;
  const result = await DateTimeService.createDateTime(
    startDate,
    endDate,
    timeSlots
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Date-time slots created successfully",
    data: result,
  });
});

const getAllDateTime = catchAsync(async (req: Request, res: Response) => {
  const result = await DateTimeService.getAllDateTime();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "service retrieved successfully",
    data: result,
  });
});

// const getSingleDateTime = catchAsync(async (req: Request, res: Response) => {
//   const id = req.params.id as string;
//   const result = await DateTimeService.getSingleDateTime(id);

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "DateTime retrieved successfully",
//     data: result,
//   });
// });
const deleteDateTime = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await DateTimeService.DeleteDateTime(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "DateTime deleted successfully",
    data: result,
  });
});

const updateDateTime = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await DateTimeService.updateDateTime(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "DateTime updated successfully",
    data: result,
  });
});

export const DateTimeController = {
  createDateTime,
  getAllDateTime,
  // getSingleDateTime,
  deleteDateTime,
  updateDateTime,
};
