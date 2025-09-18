import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import userController from "../controllers/userController";

const router = Router();

router.get("/me", authMiddleware, userController.meController);


export default router;
