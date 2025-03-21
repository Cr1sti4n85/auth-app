import { AppErrorCode } from "../config/appErrorCode";
import { HttpStatusCodes } from "../config/statusCodes";

export type AppAssert = (
  condition: any,
  httpStatusCode: HttpStatusCodes,
  message: string,
  appErrorCode?: AppErrorCode
) => asserts condition;
