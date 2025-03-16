import VerificationCodeModel from "../models/verificationCode.model";
import {
  IVerificationRepository,
  Verification,
} from "../types/verification.types";
import { Query } from "../types/repository.types";

export class VerificationRepository implements IVerificationRepository {
  async create(data: Partial<Verification>): Promise<Verification> {
    const newVerificationCode = new VerificationCodeModel(data);
    return await newVerificationCode.save();
  }
  async exists(query: Query): Promise<{} | null> {
    return await VerificationCodeModel.exists(query);
  }
}
