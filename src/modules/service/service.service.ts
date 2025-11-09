import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { envVars } from "../../config/env";
import AppError from "../../helpers/AppError";

const prisma = new PrismaClient();

const createService = async (data: any) => {
  const newService = await prisma.service.create({
    data,
  });
  return newService;
};

const getAllService = async () => {
  const result = await prisma.service.findMany();
  return result;
};

export const ServicesService = {
  createService,
  getAllService
};
