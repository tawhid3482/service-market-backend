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

const getSingleService = async (id:string) => {
  const result = await prisma.service.findUnique({
    where:{
      id
    }
  });
  return result;
};

const DeleteService = async (id:string) => {
  const result = await prisma.service.delete({
    where:{
      id
    }
  });
  return result;
};

const updateService = async (id: string, data: any) => {
  const result = await prisma.service.update({
    where: { id },
    data: data, 
  });

  return result;
};


export const ServicesService = {
  createService,
  getAllService,
  getSingleService,
  DeleteService,
  updateService
  
};
