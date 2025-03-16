import UserModel from "../models/user.model";
import { IAuthRepository, User } from "../types/auth.types";
import { Query } from "../types/repository.types";

export class AuthRepository implements IAuthRepository {
  async create(data: User): Promise<User> {
    const newUser = new UserModel(data);
    return await newUser.save();
  }

  async exists(data: Query): Promise<{} | null> {
    return await UserModel.exists(data);
  }
}
