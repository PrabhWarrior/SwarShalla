import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";
import { sendError } from "../utils/responseHandler";

interface AppError extends Error {
  statusCode?: number;
}

export function errorMiddleware(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error(`[Error] ${req.method} ${req.url}:`, err);

  const statusCode = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === "production"
      ? "Something went wrong!"
      : err.message;

  return sendError(res, message, statusCode);
}
