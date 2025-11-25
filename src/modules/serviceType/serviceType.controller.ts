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
const getAllServiceTypeForDashboard = catchAsync(async (req: Request, res: Response) => {
  const result = await ServicesTypeService.getServiceTypeForDashboard();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Button service Type retrieved successfully",
    data: result,
  });
});

const getSingleServiceType = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await ServicesTypeService.getSingleServiceType(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Single Service Type retrieved successfully",
    data: result,
  });
});

const deleteServiceType = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await ServicesTypeService.DeleteServiceType(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Service Type deleted successfully",
    data: result,
  });
});

const updateServiceType = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await ServicesTypeService.updateServiceType(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Service Type updated successfully",
    data: result,
  });
});

export const ServiceTypeController = {
  createServiceType,
  getAllServiceType,
  getSingleServiceType,
  deleteServiceType,
  updateServiceType,
  getAllServiceTypeForDashboard
};
