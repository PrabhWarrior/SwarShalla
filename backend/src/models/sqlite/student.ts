import { openSqliteDb } from "../../config/db";
import { SQLITE_UUID_DEFAULT } from "../../utils/sqliteUuid";

export async function createStudentsTable() {
  const db = await openSqliteDb();

  await db.run(`
    CREATE TABLE IF NOT EXISTS students (
      student_id TEXT PRIMARY KEY DEFAULT ${SQLITE_UUID_DEFAULT},
      user_id TEXT NOT NULL UNIQUE,
      joined_date DATE NOT NULL,
      is_married INTEGER NOT NULL DEFAULT 0 CHECK(is_married IN (0,1)),
      FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
    );
  `);
}
