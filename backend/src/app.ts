import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import "dotenv/config";
import { connectMongo } from "./config/db";
import { initSQLiteTables } from "./models/sqlite";
import { authRoutes, userRoutes } from "./routes";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import logger from "./utils/logger";
import { sendSuccess } from "./utils/responseHandler";
import { StatusCodes } from "http-status-codes";

const app = express();
app.use(express.json());

app.use(helmet());
app.use(cors({ origin: "*", credentials: true }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(hpp());

app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

app.get("/", (_req, res) =>
  sendSuccess(res, null, "Server is running...", StatusCodes.OK)
);

app.get("/health", (_req, res) =>
  sendSuccess(res, null, "Server is healthy", StatusCodes.OK)
);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

export async function initApp() {
  try {
    await initSQLiteTables();
    await connectMongo();
    logger.info("Databases initialized");
  } catch (err) {
    logger.error("Failed to initialize app:", err);
    process.exit(1);
  }
}

app.use(errorMiddleware);

export default app;
