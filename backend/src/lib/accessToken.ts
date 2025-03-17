import jwt from "jsonwebtoken";
import { Session } from "../types/session.types";
import { JWT_SECRET } from "../config/envConfig";
import { User } from "../types/auth.types";

export const createAccess = (newUser: User, session: Session) => {
  const accessToken = jwt.sign(
    {
      userId: newUser._id,
      sessionId: session._id,
    },
    JWT_SECRET,
    {
      expiresIn: "15m",
      audience: ["user"],
    }
  );

  return accessToken;
};
