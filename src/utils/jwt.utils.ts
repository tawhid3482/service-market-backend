// src/utils/jwt.util.ts
import jwt, { SignOptions, Secret } from "jsonwebtoken";

const JWT_SECRET: Secret = process.env.JWT_SECRET || "change_this_secret";

export function signJwt(payload: object, expiresIn: string = "7d") {
  const options: SignOptions = { expiresIn } as any;
  return jwt.sign(payload, JWT_SECRET, options);
}

export function verifyJwt<T = any>(token: string): T | null {
  try {
    return jwt.verify(token, JWT_SECRET) as T;
  } catch (err) {
    return null;
  }
}
