import { PrismaClient } from "@prisma/client";
import AppError from "../../helpers/AppError";

const prisma = new PrismaClient();

const createBooking = async (data: any) => {
  const newBooking = await prisma.booking.create({
    data,
  });
  return newBooking;
};

const getAllBooking = async () => {
  const result = await prisma.booking.findMany({
    orderBy:{
      createdAt:"desc"
    }
  });
  return result;
};

const getSingleBooking = async (id:string) => {
  const result = await prisma.booking.findUnique({
    where: {
      id,
    },
  });
  return result;
};
const DeleteBooking = async (id: string) => {
  const result = await prisma.booking.delete({
    where: {
      id,
    },
  });
  return result;
};

const updateBooking = async (id: string, data: any) => {
  const result = await prisma.booking.update({
    where: { id },
    data: data,
  });

  return result;
};

export const BookingServices = {
  createBooking,
  getAllBooking,
  getSingleBooking,
  DeleteBooking,
  updateBooking,
  // getAllUserBooking
};
