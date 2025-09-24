import { openSqliteDb } from "../../config/db";
import { SQLITE_UUID_DEFAULT } from "../../utils/sqliteUuid";

export async function createFeesTable() {
  const db = await openSqliteDb();

  await db.run(`
    CREATE TABLE IF NOT EXISTS fees (
      fee_id TEXT PRIMARY KEY DEFAULT ${SQLITE_UUID_DEFAULT},
      student_id TEXT NOT NULL,
      amount DECIMAL(10,2) NOT NULL CHECK(amount > 0),
      due_date DATE NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('Pending','Paid')),
      FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
    );
  `);
}
