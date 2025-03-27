import { Request, Response } from "express";
import asyncHandler from "../lib/asyncHandler";
import { NOT_FOUND, OK } from "../config/statusCodes";
import { ISessionRepository, ISessionService } from "../types/session.types";
import { SessionRepository } from "../repositories/session.repository";
import { SessionService } from "../services/session.service";
import { z } from "zod";
import appAssert from "../lib/appAssert";

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

export const deleteSessionHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const sessionId = z.string().parse(req.params.id);

    const deleted = await sessionService.findSessionAndDelete(
      sessionId,
      req.userId as string
    );

    appAssert(deleted, NOT_FOUND, "Session not found");

    return res.status(OK).json({
      message: "Session removed",
    });
  }
);
