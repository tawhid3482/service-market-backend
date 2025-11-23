import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { ServicesService } from "./service.service";

const createService = catchAsync(async (req: Request, res: Response) => {
  const result = await ServicesService.createService(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "service created successfully",
    data: result,
  });
});

const getAllService = catchAsync(async (req: Request, res: Response) => {
  const result = await ServicesService.getAllService();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "service retrieved successfully",
    data: result,
  });
});

const getSingleService = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string
  const result = await ServicesService.getSingleService(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Service retrieved successfully",
    data: result,
  });
});
const deleteService = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string
  const result = await ServicesService.DeleteService(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Service deleted successfully",
    data: result,
  });
});

const updateService = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string
  const result = await ServicesService.updateService(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Service updated successfully",
    data: result,
  });
});




export const ServiceController = {
  createService,
  getAllService,
  getSingleService,
  deleteService,
  updateService,
};
