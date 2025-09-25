import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import { StatusCodes } from "http-status-codes";
import { sendSuccess, sendError } from "../utils/responseHandler";
import logger from "../utils/logger";
import userService from "../services/userService";

const me = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return sendError(res, "User not authenticated", StatusCodes.UNAUTHORIZED);
    }

    const user = await userService.getUserById(req.user.id);
    if (!user) return sendError(res, "User not found", StatusCodes.NOT_FOUND);

    return sendSuccess(res, user, "User fetched successfully", StatusCodes.OK);
  } catch (error: any) {
    logger.error("Error in /me endpoint:", error);
    return sendError(
      res,
      "Failed to fetch user data",
      StatusCodes.INTERNAL_SERVER_ERROR,
      error.message
    );
  }
};

const getAllUsers = async (_req: any, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    return sendSuccess(
      res,
      users,
      "Users fetched successfully",
      StatusCodes.OK
    );
  } catch (error: any) {
    return sendError(
      res,
      "Failed to fetch users",
      StatusCodes.INTERNAL_SERVER_ERROR,
      error.message
    );
  }
};

const getUserById = async (req: any, res: Response) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) return sendError(res, "User not found", StatusCodes.NOT_FOUND);

    return sendSuccess(res, user, "User fetched successfully", StatusCodes.OK);
  } catch (error: any) {
    return sendError(
      res,
      "Failed to fetch user",
      StatusCodes.INTERNAL_SERVER_ERROR,
      error.message
    );
  }
};

const createUser = async (req: any, res: Response) => {
  try {
    const user = await userService.createUser(req.body);
    return sendSuccess(
      res,
      user,
      "User created successfully",
      StatusCodes.CREATED
    );
  } catch (error: any) {
    return sendError(
      res,
      "Failed to create user",
      StatusCodes.INTERNAL_SERVER_ERROR,
      error.message
    );
  }
};

const updateUser = async (req: any, res: Response) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    if (!user) return sendError(res, "User not found", StatusCodes.NOT_FOUND);

    return sendSuccess(res, user, "User updated successfully", StatusCodes.OK);
  } catch (error: any) {
    return sendError(
      res,
      "Failed to update user",
      StatusCodes.INTERNAL_SERVER_ERROR,
      error.message
    );
  }
};

const deleteUser = async (req: any, res: Response) => {
  try {
    const deleted = await userService.deleteUser(req.params.id);
    if (!deleted)
      return sendError(res, "User not found", StatusCodes.NOT_FOUND);

    return sendSuccess(res, null, "User deleted successfully", StatusCodes.OK);
  } catch (error: any) {
    return sendError(
      res,
      "Failed to delete user",
      StatusCodes.INTERNAL_SERVER_ERROR,
      error.message
    );
  }
};

const userController = {
  me,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};

export default userController;
