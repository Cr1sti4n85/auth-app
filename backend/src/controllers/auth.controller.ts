import { NextFunction, Request, Response } from "express";
import asyncHandler from "../lib/asyncHandler";
import { registerSchema } from "../schemas/register.schema";
import { IAuthRepository, IAuthService } from "../types/auth.types";
import { AuthRepository } from "../repositories/auth.repository";
import { AuthService } from "../services/auth.service";
import {
  IVerificationRepository,
  IVerificationService,
  VerificationCodeType,
} from "../types/verification.types";
import { VerificationRepository } from "../repositories/verification.repository";
import { VerificationService } from "../services/verification.service";
import mongoose from "mongoose";

const authRepository: IAuthRepository = new AuthRepository();
const authService: IAuthService = new AuthService(authRepository);

const verificationRepository: IVerificationRepository =
  new VerificationRepository();
const verificationService: IVerificationService = new VerificationService(
  verificationRepository
);

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

    //create verification code
    if (newUser && newUser._id) {
      const verificationCode = await verificationService.createVerificationCode(
        {
          userId: newUser._id,
          type: VerificationCodeType.EmailVerification,
          expiresAt: new Date(),
          createdAt: new Date(),
        }
      );
    }
  }
);
