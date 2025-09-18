import Database from "better-sqlite3";
import mongoose from "mongoose";

export const sqliteDb = new Database("school.db");

export async function connectMongo() {
  await mongoose.connect(
    process.env.MONGO_URI!
  );
  console.log("MongoDB connected")
}
