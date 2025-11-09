import { z } from "zod";

export const registerUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

