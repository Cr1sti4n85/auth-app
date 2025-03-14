import { Document } from "mongoose";
import { Repository } from "./repository.types";

export interface User extends Document {
  //   _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  userAgent?: string;
}

export interface IUserRepository extends Repository<User> {}

export interface IUserService {
  createUser(data: Partial<User>): Promise<User>;
}
