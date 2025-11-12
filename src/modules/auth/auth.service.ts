
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
import bcrypt from "bcrypt";
import { signJwt } from "../../utils/jwt.utils";

export async function findUserByPhone(phone: string) {
  return prisma.user.findUnique({ where: { phone } });
}

export async function createUserViaOtp({ phone, fullName, email }: { phone: string; fullName?: string; email?: string; }) {
  const defaultName = fullName || `User ${phone.slice(-4)}`;
  const defaultEmail = email || `${phone.replace(/[^0-9]/g, "")}@tempuser.com`;

  const hashedPassword = await bcrypt.hash(`${phone}_otp_login`, 10);

  const address = {
    recipientName: defaultName,
    buildingInfo: "",
    streetInfo: "",
    locality: "",
    city: "",
    state: "",
    country: "",
    postalCode: ""
  };

  const user = await prisma.user.create({
    data: {
      phone,
      fullName: defaultName,
      email: defaultEmail,
      address,
      password: hashedPassword,
      registeredViaOtp: true
    }
  });

  const token = signJwt({ id: user.id });

  const safeUser = { ...user, password: undefined };
  return { user: safeUser, token };
}

export async function registerUser({ phone, fullName, email, password, address }: { phone: string; fullName: string; email: string; password?: string; address?: any; }) {
  // checks
  const existsPhone = await prisma.user.findUnique({ where: { phone } });
  if (existsPhone) throw new Error("Phone already registered");

  if (email) {
    const existsEmail = await prisma.user.findUnique({ where: { email } });
    if (existsEmail) throw new Error("Email already registered");
  }

  const hashed = password ? await bcrypt.hash(password, 10) : await bcrypt.hash(`${phone}_temp_otp_password`, 10);

  const user = await prisma.user.create({
    data: {
      phone,
      fullName,
      email,
      address: address || {},
      password: hashed
    }
  });

  const token = signJwt({ id: user.id });
  const safeUser = { ...user, password: undefined };
  return { user: safeUser, token };
}

export async function loginUser({ phone, password }: { phone: string; password: string; }) {
  const user = await prisma.user.findUnique({ where: { phone } });
  if (!user) throw new Error("Invalid credentials");

  if (!user.password) throw new Error("No password set for this user");

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error("Invalid credentials");

  const token = signJwt({ id: user.id });
  const safeUser = { ...user, password: undefined };
  return { user: safeUser, token };
}


export const authService = {
  registerUser,
  loginUser,
  findUserByPhone,
  createUserViaOtp,

};
