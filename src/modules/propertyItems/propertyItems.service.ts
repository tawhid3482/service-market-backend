import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const createPropertyItems = async (data: any) => {
  const newProperty = await prisma.propertyItem.create({
    data,
  });
  return newProperty;
};

const getAllPropertyItems = async () => {
  const result = await prisma.propertyItem.findMany({});
  return result;
};

const getSinglePropertyItems = async (id:string) => {
  const result = await prisma.propertyItem.findUnique({
    where:{id}
  });
  return result;
};

export const PropertyItemsServices = {
  createPropertyItems,
  getAllPropertyItems,
  getSinglePropertyItems
};
