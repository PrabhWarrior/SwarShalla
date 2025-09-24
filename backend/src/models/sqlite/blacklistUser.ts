import { openSqliteDb } from "../../config/db";
import { SQLITE_UUID_DEFAULT } from "../../utils/sqliteUuid";

export async function blacklistedTokensTable() {
  const db = await openSqliteDb();

  await db.run(`
    CREATE TABLE IF NOT EXISTS blacklisted_tokens (
        id TEXT PRIMARY KEY DEFAULT ${SQLITE_UUID_DEFAULT},
        token TEXT NOT NULL UNIQUE,
        user_id TEXT NOT NULL,
        expires_at DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
    );
  `);

  await db.run(`
    CREATE INDEX IF NOT EXISTS idx_blacklisted_tokens_token 
    ON blacklisted_tokens(token);
  `);

  await db.run(`
    CREATE INDEX IF NOT EXISTS idx_blacklisted_tokens_expires 
    ON blacklisted_tokens(expires_at);
  `);
}
