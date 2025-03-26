import { Request, Response } from "express";
import asyncHandler from "../lib/asyncHandler";
import { IAuthRepository, IAuthService } from "../types/auth.types";
import { AuthRepository } from "../repositories/auth.repository";
import { AuthService } from "../services/auth.service";
import appAssert from "../lib/appAssert";
import { NOT_FOUND, OK } from "../config/statusCodes";

const authRepository: IAuthRepository = new AuthRepository();
const authService: IAuthService = new AuthService(authRepository);

export const getUserHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authService.findUserBy({ _id: req.userId });

    appAssert(user, NOT_FOUND, "User not found");

    return res.status(OK).json(user.omitPassword());
  }
);
