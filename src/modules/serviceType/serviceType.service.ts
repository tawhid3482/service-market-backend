import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { envVars } from "../../config/env";
import AppError from "../../helpers/AppError";
import { includes } from "zod";

const prisma = new PrismaClient();

const createServiceType = async (data: any) => {
  const newService = await prisma.serviceType.create({
    data,
  });
  return newService;
};

const getAllServiceType = async () => {
  const result = await prisma.serviceType.findMany({
    include: {
      service: true, // Include related service data
    },
  });
  return result;
};

export const ServicesTypeService = {
  createServiceType,
  getAllServiceType
};
