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
      _count: {
        select: {
          propertyItems: true,
        },
      },
    },
  });

  // Optional: যদি তুমি চাই _count না থেকে একটা clean key propertyItemCount দিতে
  const formatted = result.map((item) => ({
    id: item.id,
    image: item.image,
    title: item.title,
    description: item.description,
    startFrom: item.startFrom,
    serviceTypeId: item.serviceTypeId,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    propertyItemCount: item._count.propertyItems,
  }));

  return formatted;
};


export const PropertyTypeServices = {
  createPropertyType,
  getAllPropertyType,
};
