import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { PropertyItemsServices } from "./propertyItems.service";

const createPropertyItems = catchAsync(async (req: Request, res: Response) => {
  const result = await PropertyItemsServices.createPropertyItems(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Property Items created successfully",
    data: result,
  });
});

const getAllPropertyItems = catchAsync(async (req: Request, res: Response) => {
  const result = await PropertyItemsServices.getAllPropertyItems();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Property Items retrieved successfully",
    data: result,
  });
});

const getSinglePropertyItems = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const result = await PropertyItemsServices.getSinglePropertyItems(id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Single property Items retrieved successfully",
      data: result,
    });
  }
);

export const PropertyItemsController = {
  createPropertyItems,
  getAllPropertyItems,
  getSinglePropertyItems,
};
