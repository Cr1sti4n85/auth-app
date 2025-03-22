import { Document, Types } from "mongoose";
import { Query, Repository } from "./repository.types";
import { AccessTokenPayload } from "../lib/jwt";

export interface Session extends Document {
  userId: Partial<Types.ObjectId>;
  userAgent?: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface ISessionRepository extends Repository<Session> {
  findAndDelete(data: string): Promise<Session | null>;
}

export interface ISessionService {
  createSession(data: Partial<Session>): Promise<Session>;
  existSession(query: Query): Promise<{} | null>;
  findSessionAndDelete(data: string): Promise<Session | null>;
}
