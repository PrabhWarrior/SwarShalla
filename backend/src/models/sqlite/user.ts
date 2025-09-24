import { openSqliteDb } from "../../config/db";
import { SQLITE_UUID_DEFAULT } from "../../utils/sqliteUuid";

export async function createUserTable() {
  const db = await openSqliteDb();

  await db.run(`
    CREATE TABLE IF NOT EXISTS users (
      user_id TEXT PRIMARY KEY DEFAULT ${SQLITE_UUID_DEFAULT},
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'student' CHECK(role IN ('teacher','student','admin')),
      is_blind INTEGER NOT NULL DEFAULT 0 CHECK(is_blind IN (0,1))
    );
  `);
}
