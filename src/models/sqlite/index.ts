import { createUserReposTable } from "./user";
import { createStudentsTable } from "./student";
import { createAttendanceTable } from "./attendance";
import { createFeesTable } from "./fees";
import { createPaymentsTable } from "./payments";
import { blacklistedTokensTable } from "./blacklistUser";
import { passwordResetsTable } from "./passwordResets";
import logger from "../../utils/logger";

export function initSQLiteTables() {
  createUserReposTable();
  createStudentsTable();
  createAttendanceTable();
  createFeesTable();
  createPaymentsTable();
  blacklistedTokensTable();
  passwordResetsTable();
  logger.info("SQLite tables initialized");
}
