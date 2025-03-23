import { NextFunction, Request, Response } from "express";
import asyncHandler from "../lib/asyncHandler";
import { registerSchema, loginSchema } from "../schemas/auth.schema";
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
import { CONFLICT, CREATED, OK, UNAUTHORIZED } from "../config/statusCodes";
import { clearAuthCookies, setAuthCookies } from "../lib/setCookies";
import appAssert from "../lib/appAssert";
import { signToken, verifyToken } from "../lib/jwt";
import { refreshTokenSignOptions } from "../lib/jwt";

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

      const refreshToken = signToken(
        {
          sessionId: session._id as string,
        },
        refreshTokenSignOptions
      );

      const accessToken = signToken({
        userId: newUser._id,
        sessionId: session._id as string,
      });

      //setAuthCookies returns the response
      return setAuthCookies({ res, accessToken, refreshToken })
        .status(CREATED)
        .json(newUser.omitPassword());
    }
  }
);

export const loginHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const request = loginSchema.parse({
      ...req.body,
      userAgent: req.headers["user-agent"],
    });

    //get user by email
    const user = await authService.findUserByEmail(request.email);
    appAssert(user, UNAUTHORIZED, "Invalid email or password");
    //validate password
    const isValidPassword: boolean = await authService.validateUserPassword(
      user,
      request.password
    );
    appAssert(isValidPassword, UNAUTHORIZED, "Invalid email or password");

    if (user && user._id) {
      //create session
      const session = await sessionService.createSession({
        userId: user._id,
        userAgent: request.userAgent,
      });

      //sign access token and refresh token
      const refreshToken = signToken(
        {
          sessionId: session._id as string,
        },
        refreshTokenSignOptions
      );

      const accessToken = signToken({
        userId: user._id,
        sessionId: session._id as string,
      });
      //return user and tokens

      return setAuthCookies({ res, accessToken, refreshToken })
        .status(OK)
        .json({
          message: "Login successful",
        });
    }
  }
);

export const logoutHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies["accessToken"] as string | undefined;

    const { payload } = verifyToken(accessToken || "");

    if (payload) {
      //remove session
      await sessionService.findSessionAndDelete(payload.sessionId as string);
    }

    return clearAuthCookies(res).status(OK).json({
      message: "Logout successful",
    });
  }
);

export const refreshHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies["refreshToken"] as string | undefined;

    appAssert(refreshToken, UNAUTHORIZED, "Missin refresh token");
  }
);
