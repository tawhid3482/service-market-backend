import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import AppError from "../../helpers/AppError";
import { envVars } from "../../config/env";

const prisma = new PrismaClient();

const createUser = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const existing = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (existing) throw new AppError(400, "Email already registered");

  const hashedPassword = await bcrypt.hash(
    data.password,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: "TRAINEE",
    },
  });
  // hide password
  const { password, ...safeUser } = user;
  return safeUser;
};

const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }
  // hide password
  const { password, ...safeUser } = user;
  return safeUser;
};

export const userServices = {
  createUser,
  getMe,
};
