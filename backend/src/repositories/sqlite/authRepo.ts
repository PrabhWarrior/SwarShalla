import { openSqliteDb } from "../../config/db";

import { PasswordReset } from "../../interfaces/authInterface";
import logger from "../../utils/logger";

const isTokenBlackListed = async (token: string): Promise<boolean> => {
  const db = await openSqliteDb();
  const row = await db.get(
    `SELECT 1 FROM blacklisted_tokens WHERE token = ? AND expires_at > datetime('now')`,
    token
  );
  return !!row;
};

const tokenDeleteBlacklist = async (): Promise<number> => {
  const db = await openSqliteDb();
  const result = await db.run(
    `DELETE FROM blacklisted_tokens WHERE expires_at <= datetime('now')`
  );
  return result.changes || 0;
};

const tokenAddBlacklist = async (
  token: string,
  userId: string,
  exp: number
): Promise<{ success: boolean; wasNew?: boolean; error?: string }> => {
  try {
    const expiresAt = new Date(exp * 1000).toISOString();
    const db = await openSqliteDb();
    const result = await db.run(
      `INSERT OR IGNORE INTO blacklisted_tokens (token, user_id, expires_at) VALUES (?, ?, ?)`,
      token,
      userId,
      expiresAt
    );
    return { success: true, wasNew: !!result.changes };
  } catch (error: any) {
    logger.error("Error blacklisting token:", error);
    return { success: false, error: error.message };
  }
};

const updatePassword = async (
  userId: string,
  newHash: string
): Promise<boolean> => {
  const db = await openSqliteDb();
  const result = await db.run(
    `UPDATE users SET password_hash = ? WHERE user_id = ?`,
    newHash,
    userId
  );
  return !!result.changes;
};

const createPasswordReset = async (
  userId: string,
  token: string,
  expiresAt: Date
): Promise<string> => {
  const db = await openSqliteDb();
  const result = await db.run(
    `INSERT INTO password_resets (user_id, token, expires_at) VALUES (?, ?, ?)`,
    userId,
    token,
    expiresAt.toISOString()
  );
  return result.lastID?.toString() || "";
};

const findPasswordReset = async (
  token: string
): Promise<PasswordReset | undefined> => {
  const db = await openSqliteDb();
  const row = await db.get(
    `SELECT * FROM password_resets WHERE token = ?`,
    token
  );
  return row as PasswordReset | undefined;
};

const deletePasswordReset = async (token: string): Promise<boolean> => {
  const db = await openSqliteDb();
  const result = await db.run(
    `DELETE FROM password_resets WHERE token = ?`,
    token
  );
  return !!result.changes;
};

const authRepo = {
  isTokenBlackListed,
  tokenDeleteBlacklist,
  tokenAddBlacklist,
  updatePassword,
  createPasswordReset,
  findPasswordReset,
  deletePasswordReset,
};

export default authRepo;
