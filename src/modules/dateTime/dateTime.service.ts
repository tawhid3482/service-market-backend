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
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0]!; // ✅ non-null assertion

  // 1️⃣ Delete all past dates
  await prisma.dateTime.deleteMany({
    where: {
      date: {
        lt: todayStr,
      },
    },
  });

  // 2️⃣ Get remaining dates serially
  const result = await prisma.dateTime.findMany({
    orderBy: {
      date: "asc",
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
  // getSingleDateTime,
  DeleteDateTime,
  updateDateTime,
};
