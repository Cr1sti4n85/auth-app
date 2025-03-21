import { z } from "zod";

const emailSchema = z.string().email().min(2).max(200);
const passwordSchema = z.string().min(8).max(25);

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  userAgent: z.string().optional(),
});

export const registerSchema = loginSchema
  .extend({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(8).max(25),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
