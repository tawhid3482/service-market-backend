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

const DeleteService = async (id: string) => {
  // 1. find all serviceTypes under this service
  const serviceTypes = await prisma.serviceType.findMany({
    where: { serviceId: id },
    select: { id: true },
  });

  const serviceTypeIds = serviceTypes.map(st => st.id);

  // 2. find all propertyTypes under these serviceTypes
  const propertyTypes = await prisma.propertyType.findMany({
    where: { serviceTypeId: { in: serviceTypeIds } },
    select: { id: true },
  });

  const propertyTypeIds = propertyTypes.map(pt => pt.id);

  // 3. delete all propertyItems
  await prisma.propertyItem.deleteMany({
    where: { propertyTypeId: { in: propertyTypeIds } },
  });

  // 4. delete all propertyTypes
  await prisma.propertyType.deleteMany({
    where: { serviceTypeId: { in: serviceTypeIds } },
  });

  // 5. delete all serviceTypes
  await prisma.serviceType.deleteMany({
    where: { serviceId: id },
  });

  // 6. finally delete the service
  const result = await prisma.service.delete({
    where: { id },
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
