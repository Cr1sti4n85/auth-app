import { NextFunction, Request, Response } from "express";
import asyncHandler from "../lib/asyncHandler";
import { registerSchema } from "../schemas/register.schema";
import { IAuthRepository, IAuthService } from "../types/auth.types";
import { AuthRepository } from "../repositories/auth.repository";
import { AuthService } from "../services/auth.service";

const authRepository: IAuthRepository = new AuthRepository();
const authService: IAuthService = new AuthService(authRepository);

export const registerHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    //validating request
    const request = registerSchema.parse({
      ...req.body,
      userAgent: req.headers["user-agent"],
    });

    const { email } = req.body;

    //verify existing user
    const existingUser = await authService.existUser({ email });

    if (existingUser) {
      throw new Error("User already exists.");
    }

    //create user
    const newUser = await authService.createUser({
      email: request.email,
      password: request.password,
    });
  }
);
