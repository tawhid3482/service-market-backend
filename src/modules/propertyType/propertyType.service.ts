import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const createPropertyType = async (data: any) => {
  const newProperty = await prisma.propertyType.create({
    data,
  });
  return newProperty;
};

const getAllPropertyType = async () => {
  const result = await prisma.propertyType.findMany({
    include: {
      serviceType:{
        include:{
          service:true
        }
      }
    },
  });



  return result;
};


const DeletePropertyType = async (id: string) => {
  await prisma.propertyItem.deleteMany({
    where: { propertyTypeId: id },
  });

  const result = await prisma.propertyType.delete({
    where: { id },
  });

  return result;
};


const updatePropertyType = async (id: string, data: any) => {
  const result = await prisma.propertyType.update({
    where: { id },
    data: data,
  });

  return result;
};



export const PropertyTypeServices = {
  createPropertyType,
  getAllPropertyType,
  DeletePropertyType,
  updatePropertyType
};
