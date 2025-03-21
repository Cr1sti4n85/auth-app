import { IAuthRepository, IAuthService, User } from "../types/auth.types";
import { Query } from "../types/repository.types";

export class AuthService implements IAuthService {
  constructor(private readonly authRepository: IAuthRepository) {}

  async createUser(data: User): Promise<User> {
    //verify existing user
    return this.authRepository.create(data);
  }

  async existUser(query: Query): Promise<{} | null> {
    return this.authRepository.exists(query);
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.authRepository.findOne({ email });
  }

  async validateUserPassword(user: User, password: string): Promise<boolean> {
    return user.comparePassword(password);
  }
}
