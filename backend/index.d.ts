import { Types } from "mongoose";

declare global {
  namespace Express {
    interface Request {
      userId: Partial<Types.ObjectId>;
      sessionId: Partial<Types.ObjectId>;
    }
  }
}

export {};
