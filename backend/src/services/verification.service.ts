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

  async findCodeByIdAndType(
    id: string,
    type: string,
    now: Date
  ): Promise<Verification | null> {
    return this.verificationRepository.findOne({
      _id: id,
      type,
      expiresAt: { $gt: now },
    });
  }

  async deleteCodeById(id: string): Promise<Verification | null> {
    return this.verificationRepository.deleteOne({ _id: id });
  }

  async countVerificationCodes(query: Query): Promise<number> {
    return this.verificationRepository.countDocuments(query);
  }
}
