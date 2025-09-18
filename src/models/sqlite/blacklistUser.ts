import { sqliteDb } from "../../config/db";

export function blacklistedTokensTable() {
  sqliteDb.exec(`
    CREATE TABLE IF NOT EXISTS blacklisted_tokens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        token TEXT NOT NULL UNIQUE,
        user_id TEXT NOT NULL,
        expires_at DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS idx_blacklisted_tokens_token ON blacklisted_tokens(token);
    CREATE INDEX IF NOT EXISTS idx_blacklisted_tokens_expires ON blacklisted_tokens(expires_at);
    `);
}
