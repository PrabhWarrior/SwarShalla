import { openSqliteDb } from "../../config/db";
import { SQLITE_UUID_DEFAULT } from "../../utils/sqliteUuid";

export async function passwordResetsTable() {
  const db = await openSqliteDb();

  await db.run(`
    CREATE TABLE IF NOT EXISTS password_resets (
      id TEXT PRIMARY KEY DEFAULT ${SQLITE_UUID_DEFAULT},
      user_id TEXT NOT NULL,
      token TEXT NOT NULL,
      expires_at DATETIME NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
    );
  `);
}
