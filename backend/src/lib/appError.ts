import { AppErrorCode } from "../config/appErrorCode";
import { HttpStatusCodes } from "../config/statusCodes";

export class AppError extends Error {
  constructor(
    public statusCode: HttpStatusCodes,
    public message: string,
    public errorCode?: AppErrorCode
  ) {
    super(message);
  }
}
