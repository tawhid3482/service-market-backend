import { Router } from "express";
import multer from "multer";
import { auth } from "../middlewares/auth";
import { validateRequest } from "../middlewares/validateRequest";
import { createClassScheduleSchema } from "../validation/class.validation";
import { classController } from "../controllers/class.controller";

const router = Router();

// 🔹 memory storage for files
const storage = multer.memoryStorage();
const upload = multer({ storage });

// 🔹 user single or multiple image পাঠাতে পারবে
router.post(
  "/",
  auth("ADMIN"),
  upload.any(), // accepts both single & multiple
  validateRequest(createClassScheduleSchema),
  classController.createClassSchedule
);

export default router;

import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { classServices } from "../services/class.service";
import { uploadMultipleToFTP } from "../../utils/uploadToFTP";

export const classController = {
  createClassSchedule: catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = req.user!.id;

      // 🔹 File Uploads
      let uploadedUrls: string[] = [];
      const files = req.files as Express.Multer.File[];

      if (files && files.length > 0) {
        uploadedUrls = await uploadMultipleToFTP(files);
      }

      // 🔹 merge body data + images
      const scheduleData = {
        ...req.body,
        images: uploadedUrls, // array of URLs
        createdBy: userId,
      };

      const schedule = await classServices.createClassSchedule(userId, scheduleData);

      sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Class schedule created successfully",
        data: schedule,
      });
    }
  ),
};


import * as ftp from "basic-ftp";
import path from "path";
import { Readable } from "stream";
import { envVars } from "../config/env";

/**
 * 🔹 Upload single file to FTP
 */
export const uploadToFTP = async (file: Express.Multer.File): Promise<string> => {
  const client = new ftp.Client();
  client.ftp.verbose = false;

  try {
    await client.access({
      host: envVars.CPANEL_HOST,
      user: envVars.CPANEL_USER,
      password: envVars.CPANEL_PASS,
      secure: false,
    });

    const remoteFileName = `${Date.now()}_${file.originalname}`;
    const remotePath = path.posix.join(envVars.CPANEL_UPLOAD_PATH, remoteFileName);

    const stream = Readable.from(file.buffer);
    await client.uploadFrom(stream, remotePath);

    return `https://${envVars.CPANEL_DOMAIN}/images/${remoteFileName}`;
  } catch (err) {
    console.error("FTP Upload Error:", err);
    throw new Error("Image upload failed");
  } finally {
    client.close();
  }
};

/**
 * 🔹 Upload multiple files to FTP
 */
export const uploadMultipleToFTP = async (files: Express.Multer.File[]): Promise<string[]> => {
  const urls: string[] = [];
  for (const file of files) {
    const url = await uploadToFTP(file);
    urls.push(url);
  }
  return urls;
};
