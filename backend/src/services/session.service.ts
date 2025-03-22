import {
  ISessionRepository,
  ISessionService,
  Session,
} from "../types/session.types";
import { Query } from "../types/repository.types";
import { AccessTokenPayload } from "../lib/jwt";

export class SessionService implements ISessionService {
  constructor(private readonly sessionRepository: ISessionRepository) {}

  async createSession(data: Session): Promise<Session> {
    return this.sessionRepository.create(data);
  }

  async existSession(query: Query): Promise<{} | null> {
    return this.sessionRepository.exists(query);
  }

  async findSessionAndDelete(data: string): Promise<Session | null> {
    return this.sessionRepository.findAndDelete(data);
  }
}
