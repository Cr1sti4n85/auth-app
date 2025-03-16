import { Document, Types } from "mongoose";
import { Query, Repository } from "./repository.types";

const enum VerificationCodeType {
  EmailVerification = "email_verification",
  PasswordReset = "password_reset",
}

export interface Verification extends Document {
  userId: Types.ObjectId;
  type: VerificationCodeType;
  expiresAt: Date;
  createdAt: Date;
}

export interface IVerificationRepository extends Repository<Verification> {}

export interface IVerificationService {
  createVerificationCode(data: Partial<Verification>): Promise<Verification>;
  existVerificationCode(query: Query): Promise<{} | null>;
}
