import { Request, Response } from "express";
import asyncHandler from "../lib/asyncHandler";
import { OK } from "../config/statusCodes";
import { ISessionRepository, ISessionService } from "../types/session.types";
import { SessionRepository } from "../repositories/session.repository";
import { SessionService } from "../services/session.service";

const sessionRepository: ISessionRepository = new SessionRepository();
const sessionService: ISessionService = new SessionService(sessionRepository);

export const getSessionHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const sessions = await sessionService.findAllSessions(
      req.userId as string,
      new Date()
    );

    return res.status(OK).json(
      sessions.map((session) => {
        return {
          ...session.toObject(),
          ...(session.id === req.sessionId && { isCurrent: true }),
        };
      })
    );
  }
);
