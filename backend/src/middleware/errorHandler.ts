import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { INTERNAL_SERVER_ERROR } from "../config/statusCodes";

const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(`PATH: ${req.path}`, err);
  res.status(INTERNAL_SERVER_ERROR).send("Internal Server Error");
};

export default errorHandler;
