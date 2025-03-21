import assert from "node:assert";
import { AppError } from "./appError";
import { AppAssert } from "../types/assert.types";

/*Asserts a condition and throws an AppError if condition is falsy */

const appAssert: AppAssert = (
  condition: any,
  httpStatusCode,
  message,
  appErrorCode
) => assert(condition, new AppError(httpStatusCode, message, appErrorCode));

export default appAssert;
