import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { ServicesTypeService } from "./serviceType.service";

const createServiceType = catchAsync(async (req: Request, res: Response) => {
  const result = await ServicesTypeService.createServiceType(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "service type created successfully",
    data: result,
  });
});

const getAllServiceType = catchAsync(async (req: Request, res: Response) => {
  const result = await ServicesTypeService.getAllServiceType();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Button service Type retrieved successfully",
    data: result,
  });
});

export const ServiceTypeController = {
  createServiceType,
  getAllServiceType,
};
