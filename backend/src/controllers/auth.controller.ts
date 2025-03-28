import { NextFunction, Request, Response } from "express";
import asyncHandler from "../lib/asyncHandler";
import {
  registerSchema,
  loginSchema,
  verificationCodeSchema,
  emailSchema,
  resetPasswordSchema,
} from "../schemas/auth.schema";
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
import {
  fiveMinutesAgo,
  ONE_DAY_MS,
  onehourFromNow,
  oneYearFromNow,
  thirtyDaysFromNow,
} from "../lib/date";
import { ISessionRepository, ISessionService } from "../types/session.types";
import { SessionRepository } from "../repositories/session.repository";
import { SessionService } from "../services/session.service";
import {
  CONFLICT,
  CREATED,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  OK,
  TOO_MANY_REQUESTS,
  UNAUTHORIZED,
} from "../config/statusCodes";
import {
  accessTokenOptions,
  clearAuthCookies,
  refreshTokenOptions,
  setAuthCookies,
} from "../lib/setCookies";
import appAssert from "../lib/appAssert";
import { RefreshTokenPayload, signToken, verifyToken } from "../lib/jwt";
import { refreshTokenSignOptions } from "../lib/jwt";
import { APP_ORIGIN } from "../config/envConfig";
import { sendEmail } from "../lib/sendEmail";
import { getVerifyEmailTemplate } from "../lib/templates/verifyEmail";
import { getPasswordResetTemplate } from "../lib/templates/passwordReset";
import { hashValue } from "../lib/bcrypt";

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

      const url = `${APP_ORIGIN}/email/verify/${verificationCode._id}`;
      const { error } = await sendEmail({
        to: newUser.email,
        ...getVerifyEmailTemplate(url),
      });

      if (error) console.log(error);

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
    const user = await authService.findUserBy({ email: request.email });
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

    appAssert(refreshToken, UNAUTHORIZED, "Missing refresh token");

    const { payload } = verifyToken<RefreshTokenPayload>(
      refreshToken,
      refreshTokenSignOptions
    );

    appAssert(payload, UNAUTHORIZED, "Invalid refresh token");

    const session = await sessionService.findSessionById(
      payload.sessionId as string
    );
    const now = Date.now();

    appAssert(
      session && session.expiresAt.getTime() > now,
      UNAUTHORIZED,
      "Session expired"
    );

    //refresh session if it expires in the next 24 hours
    const sessionNeedsRefresh = session.expiresAt.getTime() - now <= ONE_DAY_MS;

    if (sessionNeedsRefresh) {
      session.expiresAt = thirtyDaysFromNow();
      await session.save(); //TODO: implement update method in service
    }

    const newRefreshToken = sessionNeedsRefresh
      ? signToken({ sessionId: session._id as string }, refreshTokenSignOptions)
      : undefined;

    const accessToken = signToken({
      userId: session.userId,
      sessionId: session._id as string,
    });

    if (newRefreshToken) {
      res.cookie("refreshToken", newRefreshToken, refreshTokenOptions());
    }

    return res
      .status(OK)
      .cookie("accessToken", accessToken, accessTokenOptions())
      .json({ message: "Access token refreshed" });
  }
);

export const verifyEmailHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const verificationCode = verificationCodeSchema.parse(req.params.code);

    //get the verification code
    const validCode = await verificationService.findCodeByIdAndType(
      verificationCode,
      VerificationCodeType.EmailVerification,
      new Date()
    );

    appAssert(validCode, NOT_FOUND, "Invalid or expired verification code");

    //update user as verified
    const updatedUser = await authService.findUserAndUpdate(
      validCode.userId as string,
      {
        verified: true,
      }
    );

    appAssert(updatedUser, INTERNAL_SERVER_ERROR, "Failed to verify user");

    //delete verification code
    await verificationService.deleteCodeById(validCode._id as string);

    //return updated user
    return res.status(OK).json({ message: "Email was successfully verified." });
  }
);

export const sendPasswordResetHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const email = emailSchema.parse(req.body.email);

    //get user by email
    const user = await authService.findUserBy({ email });
    appAssert(user, NOT_FOUND, "User not found");

    //check email rate limit
    const fiveMinAgo = fiveMinutesAgo();
    const count = await verificationService.countVerificationCodes({
      userId: user._id,
      type: VerificationCodeType.PasswordReset,
      createdAt: { $gte: fiveMinAgo },
    });

    appAssert(
      count <= 1,
      TOO_MANY_REQUESTS,
      "Too many requests, try again in a few minutes"
    );
    //create verification code
    const expiresAt = onehourFromNow();
    const verificationCode = await verificationService.createVerificationCode({
      userId: user._id as string,
      type: VerificationCodeType.PasswordReset,
      expiresAt,
    });

    //send verification email
    const url = `${APP_ORIGIN}/password/reset?code=${
      verificationCode._id
    }&exp=${expiresAt.getTime()}`;

    const { data, error } = await sendEmail({
      to: user.email,
      ...getPasswordResetTemplate(url),
    });

    appAssert(
      data?.id,
      INTERNAL_SERVER_ERROR,
      `Failed to send email: ${error?.name} - ${error?.message}`
    );

    //return
    return res.status(OK).json({
      message: "Password reset email sent",
    });
  }
);

export const resetPasswordHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const request = resetPasswordSchema.parse(req.body);

    //get verification code
    const validCode = await verificationService.findCodeByIdAndType(
      request.verificationCode,
      VerificationCodeType.PasswordReset,
      new Date()
    );

    appAssert(validCode, NOT_FOUND, "Invalid or expired verification code");

    //update user password
    const updatedUser = await authService.findUserAndUpdate(
      validCode.userId as string,
      {
        password: await hashValue(request.password),
      }
    );

    appAssert(updatedUser, INTERNAL_SERVER_ERROR, "Failed to reset password");

    //delete verification code
    await verificationService.deleteCodeById(validCode._id as string);

    //delete all sessions
    await sessionService.deleteAllSessions({ userId: updatedUser._id });

    //user will be required to log in again
    return clearAuthCookies(res).status(OK).json({
      message: "Password reset successful",
    });
  }
);
