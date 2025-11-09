import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { envVars } from "../../config/env";
import AppError from "../../helpers/AppError";

const prisma = new PrismaClient();

const loginUser = async (data: { email: string; password: string }) => {
  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user) throw new AppError(401, "Invalid credentials");

  const valid = await bcrypt.compare(data.password, user.password);
  if (!valid) throw new AppError(401, "Invalid credentials");

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    envVars.JWT_ACCESS_SECRET,
    { expiresIn: "1d" }
  );
  const { password, ...safeUser } = user;

  return { safeUser, token };
};

export const AuthService = {
  loginUser,
};
