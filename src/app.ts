import express from "express";
import "dotenv/config";
import { connectMongo } from "./config/db";
import { initSQLiteTables } from "./models/sqlite";
import { authRoutes, userRoutes } from "./routes";
import { errorMiddleware } from "./middlewares/errorMiddleware";

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get("/", (req, res) => res.send("Server is running..."));
app.get("/health", (req, res) => res.send("Server is running..."));
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

export async function initApp() {
  try {
    initSQLiteTables();
    await connectMongo();
    console.log("Databases initialized");
  } catch (err) {
    console.error("Failed to initialize app:", err);
    process.exit(1);
  }
}

app.use(errorMiddleware);

export default app;
