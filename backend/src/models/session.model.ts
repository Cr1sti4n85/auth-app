import mongoose, { Schema } from "mongoose";
import { Session } from "../types/session.types";
import { thirtyDaysFromNow } from "../lib/date";

const SessionSchema: Schema = new Schema<Session>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      index: true,
      ref: "User",
      required: true,
    },

    userAgent: {
      type: String,
    },
    expiresAt: {
      type: Date,
      default: thirtyDaysFromNow,
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

const SessionModel = mongoose.model<Session>("Session", SessionSchema);

export default SessionModel;
