import SessionModel from "../models/session.model";
import { ISessionRepository, Session } from "../types/session.types";
import { Query } from "../types/repository.types";

export class SessionRepository implements ISessionRepository {
  async create(data: Session): Promise<Session> {
    const newSession = await SessionModel.create(data);
    return newSession;
  }

  async exists(data: Query): Promise<{} | null> {
    return await SessionModel.exists(data);
  }

  async findAll(query: Query): Promise<Session[]> {
    return await SessionModel.find(
      query,
      {
        _id: 1,
        userAgent: 1,
        createdAt: 1,
      },
      {
        sort: { createdAt: -1 },
      }
    );
  }

  async findAndDelete(
    data: string,
    userData?: string
  ): Promise<Session | null> {
    if (userData) {
      return await SessionModel.findOneAndDelete({
        _id: data,
        userId: userData,
      });
    }
    return await SessionModel.findOneAndDelete({ _id: data });
  }

  async findById(id: string): Promise<Session | null> {
    return await SessionModel.findById(id);
  }

  async deleteAll(
    query: Query
  ): Promise<{ deletedCount?: number; acknowledged?: boolean }> {
    return await SessionModel.deleteMany(query);
  }
}
