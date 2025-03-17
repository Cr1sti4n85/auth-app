import { Document, Types } from "mongoose";
import { Query, Repository } from "./repository.types";

export interface Session extends Document {
  userId: Types.ObjectId;
  userAgent?: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface ISessionRepository extends Repository<Session> {}

export interface ISessionService {
  createSession(data: Partial<Session>): Promise<Session>;
  existSession(query: Query): Promise<{} | null>;
}
