import { Request, Response, NextFunction, ErrorRequestHandler } from "express";

const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(`PATH: ${req.path}`, err);
  res.status(500).send("Internal Server Error");
};

export default errorHandler;
