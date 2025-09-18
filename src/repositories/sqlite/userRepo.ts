import { sqliteDb } from "../../config/db";
import { User } from "../../interfaces/userInterface";

const createUserRepo = (user: User) => {
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

const getUserByEmailRepo = (email: string) =>
  sqliteDb.prepare(`SELECT * FROM users WHERE email = ?`).get(email);

const getUserByIdRepo = (id: number) =>
  sqliteDb.prepare(`SELECT * FROM users WHERE user_id = ?`).get(id);

const userRepo = { createUserRepo, getUserByEmailRepo, getUserByIdRepo };
export default userRepo;
