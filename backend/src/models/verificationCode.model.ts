import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import { Verification } from "../types/verification.types";

const VerificationCodeSchema: Schema = new Schema<Verification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      index: true,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const VerificationCodeModel = mongoose.model<Verification>(
  "VerificationCode",
  VerificationCodeSchema,
  "verification_codes"
);

export default VerificationCodeModel;
