import { sqliteDb } from "../../config/db";

export function createAttendanceTable() {
  sqliteDb.exec(`
    CREATE TABLE IF NOT EXISTS attendance (
      attendance_id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      date DATE NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('Present','Absent','Late')),
      FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
      UNIQUE(student_id, date)
    );
  `);
}
