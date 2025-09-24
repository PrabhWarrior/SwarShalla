import bcrypt from "bcryptjs";
import userRepo from "../repositories/sqlite/userRepo";
import { openSqliteDb } from "../config/db";
import dotenv from "dotenv";
import { User } from "../interfaces/userInterface";
import logger from "../utils/logger";

dotenv.config();

async function main() {
  try {
    const adminName = process.env.ADMIN_NAME!;
    const adminEmail = process.env.ADMIN_EMAIL!;
    const adminPassword = process.env.ADMIN_PASSWORD!;

    if (!adminEmail || !adminPassword) {
      throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env");
    }

    const db = await openSqliteDb();

    const existing = await db.get(`SELECT * FROM users WHERE email = ?`, adminEmail);
    if (existing) {
      logger.info("Admin user already exists:", existing);
      return;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const adminUser: User = {
      name: adminName,
      email: adminEmail,
      password_hash: hashedPassword,
      role: "admin",
      is_blind: 0,
    };

    const user = await userRepo.createUser(adminUser);
    logger.info("Admin user created successfully:", user);
  } catch (err) {
    logger.error("Error creating admin user:", err);
  }
}

main();
