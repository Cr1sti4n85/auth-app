import { CookieOptions } from "express";
import { AuthCookieParams } from "../types/auth.types";
import { NODE_ENV } from "../config/envConfig";
import { fifteenMinutesFromNow, thirtyDaysFromNow } from "./date";

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
  path: "/auth/refresh", //send the refresh token only when using this path
});

export const setAuthCookies = ({
  res,
  accessToken,
  refreshToken,
}: AuthCookieParams) =>
  res
    .cookie("accessToken", accessToken, accessTokenOptions())
    .cookie("refreshToken", refreshToken, refreshTokenOptions());
