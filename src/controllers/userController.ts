import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import userRepo from "../repositories/sqlite/userRepo";
import { User } from "../interfaces/userInterface";
import { StatusCodes } from "http-status-codes";
import { sendSuccess, sendError } from "../utils/responseHandler";

const meController = (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return sendError(res, "User not authenticated", StatusCodes.UNAUTHORIZED);
    }

    const user = userRepo.getUserByIdRepo(req.user.id);
    if (!user) {
      return sendError(res, "User not found", StatusCodes.NOT_FOUND);
    }

    const { password_hash, is_blind, ...rest } = user as User;
    const safeUser = {
      ...rest,
      is_blind: !!is_blind,
    };

    return sendSuccess(
      res,
      safeUser,
      "User fetched successfully",
      StatusCodes.OK
    );
  } catch (error) {
    console.error("Error in /me endpoint:", error);
    return sendError(
      res,
      "Failed to fetch user data",
      StatusCodes.INTERNAL_SERVER_ERROR,
      error instanceof Error ? error.message : error
    );
  }
};

const userController = { meController };
export default userController;
