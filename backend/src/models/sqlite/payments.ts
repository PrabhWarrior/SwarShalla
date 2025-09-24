import { openSqliteDb } from "../../config/db";
import { SQLITE_UUID_DEFAULT } from "../../utils/sqliteUuid";

export async function createPaymentsTable() {
  const db = await openSqliteDb();

  await db.run(`
    CREATE TABLE IF NOT EXISTS payments (
      payment_id TEXT PRIMARY KEY DEFAULT ${SQLITE_UUID_DEFAULT},
      fee_id TEXT NOT NULL,
      transaction_id TEXT NOT NULL UNIQUE,
      amount_paid DECIMAL(10,2) NOT NULL CHECK(amount_paid > 0),
      payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      payment_method TEXT NOT NULL CHECK(payment_method IN ('Cash','Card','UPI','Bank Transfer')),
      FOREIGN KEY (fee_id) REFERENCES fees(fee_id) ON DELETE CASCADE
    );
  `);
}
