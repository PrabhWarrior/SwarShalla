import { sqliteDb } from "../../config/db";

export function createFeesTable() {
  sqliteDb.exec(`
    CREATE TABLE IF NOT EXISTS fees (
      fee_id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      amount DECIMAL(10,2) NOT NULL CHECK(amount > 0),
      due_date DATE NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('Pending','Paid')),
      FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
    );
  `);
}
