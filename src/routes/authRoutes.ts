import { Router } from "express";
import authController from "../controllers/authController";
import { authMiddleware } from "../middlewares/authMiddleware";
import authSchema from "../validators/authValidate";
import validate from "../middlewares/validateMiddleware";

const router = Router();

router.post(
  "/register",
  validate(authSchema.register),
  authController.register
);
router.post("/login", validate(authSchema.login), authController.login);
router.post("/logout", authMiddleware, authController.logout);
router.put(
  "/change-password",
  authMiddleware,
  validate(authSchema.changePassword),
  authController.changePassword
);

router.post(
  "/forgot-password",
  validate(authSchema.forgotPassword),
  authController.forgotPassword
);
router.post(
  "/reset-password",
  validate(authSchema.resetPassword),
  authController.resetPassword
);

export default router;
