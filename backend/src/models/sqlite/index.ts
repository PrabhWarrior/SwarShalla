import { createUserTable } from "./user";
import { createStudentsTable } from "./student";
import { createAttendanceTable } from "./attendance";
import { createFeesTable } from "./fees";
import { createPaymentsTable } from "./payments";
import { blacklistedTokensTable } from "./blacklistUser";
import { passwordResetsTable } from "./passwordResets";
import logger from "../../utils/logger";

export async function initSQLiteTables() {
  await createUserTable();
  await createStudentsTable();
  await createAttendanceTable();
  await createFeesTable();
  await createPaymentsTable();
  await blacklistedTokensTable();
  await passwordResetsTable();
  
  logger.info("SQLite tables initialized");
}
