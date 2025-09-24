import { Request, Response } from "express";
import authService from "../services/authService";
import { AuthRequest } from "../middlewares/authMiddleware";
import jwt from "jsonwebtoken";
import authRepo from "../repositories/sqlite/authRepo";
import { sendSuccess, sendError } from "../utils/responseHandler";
import { StatusCodes } from "http-status-codes";
import logger from "../utils/logger";

const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, is_blind } = req.body;
    const user = await authService.register(name, email, password, is_blind);

    return sendSuccess(
      res,
      user,
      "User registered successfully",
      StatusCodes.CREATED
    );
  } catch (err: any) {
    return sendError(res, err.message, StatusCodes.BAD_REQUEST);
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);

    return sendSuccess(res, result, "Login successful", StatusCodes.OK);
  } catch (err: any) {
    return sendError(res, err.message, StatusCodes.BAD_REQUEST);
  }
};

const logout = async (req: AuthRequest, res: Response) => {
  try {
    const token = req.headers.authorization!.split(" ")[1];
    const decoded = jwt.decode(token) as any;

    await authRepo.tokenAddBlacklist(token, req.user?.id, decoded.exp);

    return sendSuccess(res, null, "Logged out successfully", StatusCodes.OK);
  } catch (error: any) {
    logger.error("Logout error:", error);
    return sendError(
      res,
      "Failed to logout",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return sendError(
        res,
        "Both old and new password are required",
        StatusCodes.BAD_REQUEST
      );
    }

    await authService.changePassword(userId, oldPassword, newPassword);
    return sendSuccess(
      res,
      null,
      "Password updated successfully",
      StatusCodes.OK
    );
  } catch (err: any) {
    return sendError(res, err.message, StatusCodes.BAD_REQUEST);
  }
};

const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const data = await authService.forgotPassword(email);

    return sendSuccess(
      res,
      data,
      "Password reset link generated",
      StatusCodes.OK
    );
  } catch (err: any) {
    return sendError(res, err.message, StatusCodes.BAD_REQUEST);
  }
};

const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;
    const data = await authService.resetPassword(token, newPassword);

    return sendSuccess(
      res,
      data,
      "Password reset successfully",
      StatusCodes.OK
    );
  } catch (err: any) {
    return sendError(res, err.message, StatusCodes.BAD_REQUEST);
  }
};

const authController = {
  register,
  login,
  logout,
  changePassword,
  forgotPassword,
  resetPassword,
};
export default authController;
