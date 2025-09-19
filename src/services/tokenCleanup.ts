import authRepo from "../repositories/sqlite/authRepo";
import logger from "../utils/logger";

export const cleanupExpiredTokens = () => {
  try {
    const deletedCount = authRepo.tokenDeleteBlacklist();
    logger.info(`Cleaned up ${deletedCount} expired tokens`);
  } catch (error) {
    logger.error("Token cleanup error:", error);
  }
};

setInterval(cleanupExpiredTokens, 24 * 60 * 60 * 1000);
cleanupExpiredTokens();
