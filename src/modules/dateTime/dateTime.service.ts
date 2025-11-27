import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { envVars } from "../../config/env";
import AppError from "../../helpers/AppError";
import { generateDateRange } from "./generateDateRange";

const prisma = new PrismaClient();

const createDateTime = async (startDate: string, endDate: string, timeSlots: string[]) => {
  const dates = generateDateRange(startDate, endDate);

  const allData = dates.map((date:any) => ({
    date,
    time: timeSlots,
  }));

  const result = await prisma.dateTime.createMany({
    data: allData,
  });

  return result;
};

const getAllDateTime = async () => {
  const result = await prisma.dateTime.findMany();
  return result;
};

const getSingleDateTime = async (id: string) => {
  const result = await prisma.dateTime.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const DeleteDateTime = async (id: string) => {
  const result = await prisma.dateTime.delete({
    where: { id },
  });

  return result;
};

const updateDateTime = async (id: string, data: any) => {
  const result = await prisma.dateTime.update({
    where: { id },
    data: data,
  });
  return result;
};

export const DateTimeService = {
  createDateTime,
  getAllDateTime,
  getSingleDateTime,
  DeleteDateTime,
  updateDateTime,
};
