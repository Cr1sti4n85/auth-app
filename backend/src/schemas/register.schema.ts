import { z } from "zod";

export const registerSchema = z
  .object({
    email: z.string().email().min(2).max(200),
    password: z.string().min(8).max(25),
    confirmPassword: z.string().min(8).max(25),
    userAgent: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
