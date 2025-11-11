import { PrismaClient } from "@prisma/client";

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
      propertyType: {
        include: {
          propertyItems: true,
          _count: {
            select: { propertyItems: true },
          },
        },
      },
      _count: {
        select: { propertyType: true },
      },
    },
  });

  return result;
};

export const ServicesTypeService = {
  createServiceType,
  getAllServiceType,
};
