import { Router } from "express";
import authController from "../controllers/authController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/register", authController.registerController);
router.post("/login", authController.loginController);
router.post("/logout", authMiddleware, authController.logoutController);
router.put(
  "/change-password",
  authMiddleware,
  authController.changePasswordController
);

router.post("/forgot-password", authController.forgotPasswordController);
router.post("/reset-password", authController.resetPasswordController);

export default router;
