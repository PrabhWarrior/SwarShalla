import { sqliteDb } from "../../config/db";
import { User } from "../../interfaces/userInterface";

const createUser = (user: User) => {
  const stmt = sqliteDb.prepare(`
    INSERT INTO users (name, email, password_hash, role, is_blind)
    VALUES (?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    user.name,
    user.email,
    user.password_hash,
    user.role,
    user.is_blind ?? 0
  );
  return { ...user, user_id: result.lastInsertRowid as number };
};

const getUserByEmail = (email: string) =>
  sqliteDb.prepare(`SELECT * FROM users WHERE email = ?`).get(email);

const getUserById = (id: number) =>
  sqliteDb.prepare(`SELECT * FROM users WHERE user_id = ?`).get(id);

const userRepo = { createUser, getUserByEmail, getUserById };
export default userRepo;
