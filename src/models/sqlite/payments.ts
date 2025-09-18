import { sqliteDb } from "../../config/db";

export function createPaymentsTable() {
  sqliteDb.exec(`
    CREATE TABLE IF NOT EXISTS payments (
      payment_id INTEGER PRIMARY KEY AUTOINCREMENT,
      fee_id INTEGER NOT NULL,
      transaction_id TEXT NOT NULL UNIQUE,
      amount_paid DECIMAL(10,2) NOT NULL CHECK(amount_paid > 0),
      payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      payment_method TEXT NOT NULL CHECK(payment_method IN ('Cash','Card','UPI','Bank Transfer')),
      FOREIGN KEY (fee_id) REFERENCES fees(fee_id) ON DELETE CASCADE
    );
  `);
}
