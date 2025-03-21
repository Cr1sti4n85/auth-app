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
import { oneYearFromNow } from "../lib/date";
import { ISessionRepository, ISessionService } from "../types/session.types";
import { SessionRepository } from "../repositories/session.repository";
import { SessionService } from "../services/session.service";
import { CONFLICT, CREATED } from "../config/statusCodes";
import { createRefresh } from "../lib/refreshToken";
import { createAccess } from "../lib/accessToken";
import { setAuthCookies } from "../lib/setCookies";
import appAssert from "../lib/appAssert";

const authRepository: IAuthRepository = new AuthRepository();
const authService: IAuthService = new AuthService(authRepository);

const verificationRepository: IVerificationRepository =
  new VerificationRepository();
const verificationService: IVerificationService = new VerificationService(
  verificationRepository
);

const sessionRepository: ISessionRepository = new SessionRepository();
const sessionService: ISessionService = new SessionService(sessionRepository);

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

    // if (existingUser) {
    //   throw new Error("User already exists.");
    // }
    appAssert(!existingUser, CONFLICT, "User already exists");

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
          expiresAt: oneYearFromNow(),
        }
      );
      //TODO: send verification email

      //create session
      const session = await sessionService.createSession({
        userId: newUser._id,
        userAgent: request.userAgent,
      });

      const refreshToken = createRefresh(session);

      const accessToken = createAccess(newUser, session);

      //setAuthCookies returns the response
      return setAuthCookies({ res, accessToken, refreshToken })
        .status(CREATED)
        .json(newUser.omitPassword());
    }
  }
);
