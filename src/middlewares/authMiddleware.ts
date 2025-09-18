import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import  authRepo from "../repositories/sqlite/authRepo";
import { User } from "../interfaces/userInterface";

const JWT_SECRET = process.env.JWT_SECRET!;

export interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Bearer token required",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const isBlacklisted = authRepo.isTokenBlackListedRepo(token);
    if (isBlacklisted) {
      return res.status(401).json({
        error: "Token invalidated",
        message: "Please login again",
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as User;
    req.user = decoded;
    next();
  } catch (error) {
    const message =
      error instanceof jwt.TokenExpiredError
        ? "Token expired"
        : "Invalid token";

    return res.status(401).json({
      error: "Unauthorized",
      message,
    });
  }
};

export const requireRoleMiddleware = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  };
};
