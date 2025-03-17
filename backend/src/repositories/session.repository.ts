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
}
