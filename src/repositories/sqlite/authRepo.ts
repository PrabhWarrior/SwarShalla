import { sqliteDb } from "../../config/db";
import { PasswordReset } from "../../interfaces/authInterface";

const isTokenBlackListedRepo = (token: string) => {
  const stmt = sqliteDb.prepare(`
      SELECT 1 FROM blacklisted_tokens 
      WHERE token = ? AND expires_at > datetime('now')
    `);
  const result = stmt.get(token);
  return !!result;
};

const tokenDeleteBlacklistRepo = () => {
  const deleteStmt = sqliteDb.prepare(`
      DELETE FROM blacklisted_tokens 
      WHERE expires_at <= datetime('now')
    `);
  const result = deleteStmt.run();
  return result.changes;
};

const tokenAddBlacklistRepo = (token: string, userId: string, exp: number) => {
  try {
    const expiresAt = new Date(exp * 1000);

    const insertStmt = sqliteDb.prepare(`
      INSERT OR IGNORE INTO blacklisted_tokens (token, user_id, expires_at) 
      VALUES (?, ?, ?)
    `);

    const result = insertStmt.run(token, userId, expiresAt.toISOString());

    return {
      success: true,
      wasNew: result.changes > 0,
    };
  } catch (error: any) {
    console.error("Error blacklisting token:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

const updatePasswordRepo = (userId: number, newHash: string) => {
  const stmt = sqliteDb.prepare(`
    UPDATE users SET password_hash = ? WHERE user_id = ?
  `);
  const result = stmt.run(newHash, userId);
  return result.changes > 0;
};

const createPasswordResetRepo = (
  userId: number,
  token: string,
  expiresAt: Date
) => {
  sqliteDb
    .prepare(
      `INSERT INTO password_resets (user_id, token, expires_at) VALUES (?, ?, ?)`
    )
    .run(userId, token, expiresAt.toISOString());
};

const findPasswordResetRepo = (token: string): PasswordReset | undefined => {
  const row = sqliteDb
    .prepare(`SELECT * FROM password_resets WHERE token = ?`)
    .get(token);
  return row as PasswordReset | undefined;
};

const deletePasswordResetRepo = (token: string) => {
  sqliteDb.prepare(`DELETE FROM password_resets WHERE token = ?`).run(token);
};

const authRepo = {
  isTokenBlackListedRepo,
  tokenDeleteBlacklistRepo,
  tokenAddBlacklistRepo,
  updatePasswordRepo,
  createPasswordResetRepo,
  findPasswordResetRepo,
  deletePasswordResetRepo,
};

export default authRepo;
