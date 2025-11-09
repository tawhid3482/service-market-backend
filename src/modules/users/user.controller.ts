import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { userServices } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";

export const createUser = catchAsync(async (req: Request, res: Response) => {
  const user = await userServices.createUser(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User created successfully",
    data: [user],
  });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
  const id = req.user!.id;
  const user = await userServices.getMe(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User got successfully",
    data: [user],
  });
});

export const UserController = {
  createUser,
  getMe,
};
