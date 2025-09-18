import { sqliteDb } from "../../config/db";

export function createStudentsTable() {
  sqliteDb.exec(`
    CREATE TABLE IF NOT EXISTS students (
      student_id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL UNIQUE,
      joined_date DATE NOT NULL,
      is_married INTEGER NOT NULL DEFAULT 0 CHECK(is_married IN (0,1)),
      FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
    );
  `);
}
