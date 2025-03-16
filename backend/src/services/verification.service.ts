import {
  IVerificationRepository,
  IVerificationService,
  Verification,
} from "../types/verification.types";
import { Query } from "../types/repository.types";

export class VerificationService implements IVerificationService {
  constructor(
    private readonly verificationRepository: IVerificationRepository
  ) {}

  async createVerificationCode(
    data: Partial<Verification>
  ): Promise<Verification> {
    return this.verificationRepository.create(data);
  }
  async existVerificationCode(query: Query): Promise<{} | null> {
    return this.verificationRepository.exists(query);
  }
}
