import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import mongoose from "mongoose";
import logger from "../utils/logger";

sqlite3.verbose();

let db: Database<sqlite3.Database, sqlite3.Statement> | null = null;

export async function openSqliteDb(): Promise<
  Database<sqlite3.Database, sqlite3.Statement>
> {
  if (!db) {
    db = await open({
      filename: "school.db",
      driver: sqlite3.Database,
    });
    logger.info("SQLite DB connected");
  }
  return db;
}

export async function connectMongo() {
  const mongoUri = process.env.MONGO_URI!;
  try {
    await mongoose.connect(mongoUri);
    logger.info("MongoDB connected");
  } catch (err) {
    logger.error("MongoDB connection error:", err);
    throw err;
  }
}