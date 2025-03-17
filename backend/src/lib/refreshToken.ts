import jwt from "jsonwebtoken";
import { Session } from "../types/session.types";
import { JWT_REFRESH_SECRET } from "../config/envConfig";

export const createRefresh = (session: Session) => {
  const refreshToken = jwt.sign(
    {
      sessionId: session._id,
    },
    JWT_REFRESH_SECRET,
    {
      expiresIn: "15d",
      audience: ["user"],
    }
  );

  return refreshToken;
};
