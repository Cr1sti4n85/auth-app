import { IAuthRepository, IAuthService, User } from "../types/auth.types";

export class AuthService implements IAuthService {
  constructor(private readonly authRepository: IAuthRepository) {}

  async createUser(data: User): Promise<User> {
    return this.authRepository.create(data);
  }
}
