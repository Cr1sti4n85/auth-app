import { Document } from "mongoose";
import { Query, Repository } from "./repository.types";
import { Response } from "express";

export interface User extends Document {
  //   _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
  userAgent?: string;
  comparePassword(val: string): Promise<boolean>;
}

//Auth Cookies
export type AuthCookieParams = {
  res: Response;
  accessToken: string;
  refreshToken: string;
};

export interface IAuthRepository extends Repository<User> {}

export interface IAuthService {
  createUser(data: Partial<User>): Promise<User>;
  existUser(query: Query): Promise<{} | null>;
}
