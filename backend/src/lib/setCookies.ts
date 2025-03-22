import { CookieOptions, Response } from "express";
import { AuthCookieParams } from "../types/auth.types";
import { NODE_ENV } from "../config/envConfig";
import { fifteenMinutesFromNow, thirtyDaysFromNow } from "./date";

export const REFRESH_PATH = "/auth/refresh";
const cookieDefaultoptions: CookieOptions = {
  sameSite: "strict",
  httpOnly: true,
  secure: NODE_ENV !== "development",
};

const accessTokenOptions = (): CookieOptions => ({
  ...cookieDefaultoptions,
  expires: fifteenMinutesFromNow(),
});

const refreshTokenOptions = (): CookieOptions => ({
  ...cookieDefaultoptions,
  expires: thirtyDaysFromNow(),
  path: REFRESH_PATH, //send the refresh token to the cookie only when using this path
});

export const setAuthCookies = ({
  res,
  accessToken,
  refreshToken,
}: AuthCookieParams) =>
  res
    .cookie("accessToken", accessToken, accessTokenOptions())
    .cookie("refreshToken", refreshToken, refreshTokenOptions());

export const clearAuthCookies = (res: Response) =>
  res
    .clearCookie("accessToken")
    .clearCookie("refreshToken", { path: REFRESH_PATH });
