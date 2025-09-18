import { Request, Response, NextFunction } from "express";

interface AppError extends Error {
  statusCode?: number;
}

export function errorMiddleware(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(`[Error] ${req.method} ${req.url}:`, err);

  const statusCode = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === "production"
      ? "Something went wrong!"
      : err.message;

  res.status(statusCode).json({
    success: false,
    error: message,
  });
}
