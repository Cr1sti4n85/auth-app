import mongoose, { Document, Types } from "mongoose";
import { Query, Repository } from "./repository.types";

export const enum VerificationCodeType {
  EmailVerification = "email_verification",
  PasswordReset = "password_reset",
}

export interface Verification extends Document {
  userId: Partial<Types.ObjectId>;
  type: VerificationCodeType;
  expiresAt: Date;
  createdAt: Date;
}

export interface IVerificationRepository extends Repository<Verification> {
  findOne(query: Query): Promise<Verification | null>;
  deleteOne(query: Query): Promise<Verification | null>;
}

export interface IVerificationService {
  createVerificationCode(data: Partial<Verification>): Promise<Verification>;
  existVerificationCode(query: Query): Promise<{} | null>;
  findCodeByIdAndType(
    id: string,
    type: VerificationCodeType,
    expiresAt: Date
  ): Promise<Verification | null>;
  deleteCodeById(id: string): Promise<Verification | null>;
}
