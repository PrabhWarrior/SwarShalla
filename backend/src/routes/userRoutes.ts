import { Router } from "express";
import {
  authMiddleware,
  requireRoleMiddleware,
} from "../middlewares/authMiddleware";
import userController from "../controllers/userController";

const router = Router();

router.get("/me", authMiddleware, userController.me);

router.get(
  "/",
  authMiddleware,
  requireRoleMiddleware(["admin", "teacher"]),
  userController.getAllUsers
);

router.get(
  "/:id",
  authMiddleware,
  requireRoleMiddleware(["admin", "teacher"]),
  userController.getUserById
);

router.post(
  "/",
  authMiddleware,
  requireRoleMiddleware(["admin"]),
  userController.createUser
);

router.put(
  "/:id",
  authMiddleware,
  requireRoleMiddleware(["admin"]),
  userController.updateUser
);

router.delete(
  "/:id",
  authMiddleware,
  requireRoleMiddleware(["admin"]),
  userController.deleteUser
);

export default router;
