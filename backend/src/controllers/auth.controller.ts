import { NextFunction, Request, Response } from "express";
import asyncHandler from "../lib/asyncHandler";
import { registerSchema } from "../schemas/register.schema";

export const registerHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    //validating request
    const request = registerSchema.parse({
      ...req.body,
      userAgent: req.headers["user-agent"],
    });
  }
);
