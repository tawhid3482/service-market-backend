import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

const createBooking = async (data: any) => {
  const newBooking = await prisma.booking.create({
    data,
  });
  return newBooking;
};

const getAllBooking = async () => {
  const result = await prisma.booking.findMany();
  return result;
};

const getSingleBooking = async (id:string) => {
  const result = await prisma.booking.findUnique({
    where:{
      id
    }
  });
  return result;
};
const DeleteBooking = async (id:string) => {
  const result = await prisma.booking.delete({
    where:{
      id
    }
  });
  return result;
};

export const BookingServices = {
  createBooking,
  getAllBooking,
  getSingleBooking,
  DeleteBooking
};
