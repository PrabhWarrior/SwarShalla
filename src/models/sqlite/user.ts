import { sqliteDb } from "../../config/db";

export function createUserReposTable() {
  sqliteDb.exec(`
    CREATE TABLE IF NOT EXISTS users (
      user_id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('teacher','student','admin')),
      is_blind INTEGER NOT NULL DEFAULT 0 CHECK(is_blind IN (0,1))
    );
  `);
}
