import { Document } from "mongoose";
import { Repository } from "./repository.types";

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

export interface IUserRepository extends Repository<User> {}

export interface IUserService {
  createUser(data: Partial<User>): Promise<User>;
}
