import { JwtPayload, verify } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { envVars } from "../config/env";
import AppError from "../helpers/AppError";
import { Role } from "@prisma/client";

interface CustomJwtPayload extends JwtPayload {
  id: string;
  email: string;
  role: Role;
}

export const auth = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization; 

    if (!token) return next(new AppError(401, "Unauthorized access", "No token provided"));

    try {
      const decoded = verify(token, envVars.JWT_ACCESS_SECRET) as CustomJwtPayload;

      if (!roles.includes(decoded.role)) {
        return next(new AppError(403, "Forbidden", "You are not allowed"));
      }

      req.user = decoded; 
      next();
    } catch (err) {
      return next(new AppError(401, "Unauthorized access", "Invalid token"));
    }
  };
};
