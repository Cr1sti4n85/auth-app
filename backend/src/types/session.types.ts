import { Document, Types } from "mongoose";
import { Query, Repository } from "./repository.types";

export interface Session extends Document {
  userId: Partial<Types.ObjectId>;
  userAgent?: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface ISessionRepository extends Repository<Session> {
  findAndDelete(
    sessionData: string,
    userData?: string
  ): Promise<Session | null>;
  findById(id: string): Promise<Session | null>;
  deleteAll(query: Query): Promise<{}>;
  findAll(query: Query): Promise<Session[]>;
}

export interface ISessionService {
  createSession(data: Partial<Session>): Promise<Session>;
  existSession(query: Query): Promise<{} | null>;
  findSessionAndDelete(
    sessionId: string,
    userId?: string
  ): Promise<Session | null>;
  findSessionById(id: string): Promise<Session | null>;
  findAllSessions(id: string, date: Date): Promise<Session[]>;
  deleteAllSessions(query: Query): Promise<{}>;
}
