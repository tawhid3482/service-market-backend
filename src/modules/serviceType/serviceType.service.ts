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
        },
      },
    },
  });

  return result;
};
const getServiceTypeForDashboard = async () => {
  const result = await prisma.serviceType.findMany({
    include: {
      service: true,
    },
  });

  return result;
};

const getSingleServiceType = async (id: string) => {
  const result = await prisma.serviceType.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const DeleteServiceType = async (id: string) => {
  const propertyTypes = await prisma.propertyType.findMany({
    where: { serviceTypeId: id },
    select: { id: true },
  });

  const propertyTypeIds = propertyTypes.map((pt) => pt.id);

  await prisma.propertyItem.deleteMany({
    where: {
      propertyTypeId: { in: propertyTypeIds },
    },
  });

  await prisma.propertyType.deleteMany({
    where: { serviceTypeId: id },
  });

  // Step 4: এখন ServiceType delete হবে (safe)
  const result = await prisma.serviceType.delete({
    where: { id },
  });

  return result;
};


const updateServiceType = async (id: string, data: any) => {
  const result = await prisma.serviceType.update({
    where: { id },
    data: data,
  });

  return result;
};

export const ServicesTypeService = {
  createServiceType,
  getAllServiceType,
  getSingleServiceType,
  DeleteServiceType,
  updateServiceType,
  getServiceTypeForDashboard
};
