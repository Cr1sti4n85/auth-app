import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../config/statusCodes";
import { z } from "zod";

const handleZodError = (res: Response, error: z.ZodError) => {
  const errors = error.issues.map((err) => {
    return {
      path: err.path.join("."),
      message: err.message,
    };
  });

  res.status(BAD_REQUEST).json({
    message: error.message,
    errors,
  });
};

const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof z.ZodError) {
    return handleZodError(res, err);
  }
  console.log(`PATH: ${req.path}`, err);
  res.status(INTERNAL_SERVER_ERROR).send("Internal Server Error");
};

export default errorHandler;
