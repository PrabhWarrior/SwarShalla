import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import authRepo from "../repositories/sqlite/authRepo";
import { User } from "../interfaces/userInterface";
import { sendError } from "../utils/responseHandler";
import { StatusCodes } from "http-status-codes";

const JWT_SECRET = process.env.JWT_SECRET!;

export interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return sendError(res, "Bearer token required", StatusCodes.UNAUTHORIZED);
  }

  const token = authHeader.split(" ")[1];

  try {
    const isBlacklisted = await authRepo.isTokenBlackListed(token);
    if (isBlacklisted) {
      return sendError(
        res,
        "Token invalidated. Please login again.",
        StatusCodes.UNAUTHORIZED
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET) as User;
    req.user = decoded;
    next();
  } catch (error) {
    const message =
      error instanceof jwt.TokenExpiredError
        ? "Token expired"
        : "Invalid token";

    return sendError(res, message, StatusCodes.UNAUTHORIZED);
  }
};

export const requireRoleMiddleware = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return sendError(
        res,
        "Forbidden: insufficient role",
        StatusCodes.FORBIDDEN
      );
    }
    next();
  };
};
