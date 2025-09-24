import { openSqliteDb } from "../../config/db";
import { SQLITE_UUID_DEFAULT } from "../../utils/sqliteUuid";

export async function createAttendanceTable() {
  const db = await openSqliteDb();

  await db.run(`
    CREATE TABLE IF NOT EXISTS attendance (
      attendance_id TEXT PRIMARY KEY DEFAULT ${SQLITE_UUID_DEFAULT},
      student_id TEXT NOT NULL,
      date DATE NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('Present','Absent','Late')),
      FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
      UNIQUE(student_id, date)
    );
  `);
}
