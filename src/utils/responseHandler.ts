import { Response } from "express";
import { StatusCodes } from "http-status-codes";

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
  error?: string | object;
  details?: any;
}

export function sendSuccess(
  res: Response,
  data: any,
  message = "Success",
  statusCode: number = StatusCodes.OK
) {
  const response: ApiResponse = {
    success: true,
    message,
    data,
  };
  return res.status(statusCode).json(response);
}

export function sendError(
  res: Response,
  error: string | object,
  statusCode: number = StatusCodes.BAD_REQUEST,
  details?: any
) {
  const response: ApiResponse = {
    success: false,
    message: typeof error === "string" ? error : "Request failed",
    error,
    details,
  };
  return res.status(statusCode).json(response);
}
