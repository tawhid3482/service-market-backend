import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { PropertyTypeServices } from "./propertyType.service";

const createPropertyType = catchAsync(async (req: Request, res: Response) => {
  const result = await PropertyTypeServices.createPropertyType(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Property type created successfully",
    data: result,
  });
});

const getAllPropertyType = catchAsync(async (req: Request, res: Response) => {
  const result = await PropertyTypeServices.getAllPropertyType();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Property Type retrieved successfully",
    data: result,
  });
});

export const PropertyTypeController = {
  createPropertyType,
  getAllPropertyType,
};
