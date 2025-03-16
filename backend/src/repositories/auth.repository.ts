import UserModel from "../models/user.model";
import { IAuthRepository, User } from "../types/auth.types";
import { Query } from "../types/repository.types";

export class AuthRepository implements IAuthRepository {
  async create(data: User): Promise<User> {
    const newUser = await UserModel.create(data);
    return newUser;
  }

  async exists(data: Query): Promise<{} | null> {
    return await UserModel.exists(data);
  }
}
