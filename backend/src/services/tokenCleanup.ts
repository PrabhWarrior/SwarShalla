import authRepo from "../repositories/sqlite/authRepo";
import logger from "../utils/logger";

const cleanupExpiredTokens = async () => {
  try {
    const deletedCount = await authRepo.tokenDeleteBlacklist();
    logger.info(`Cleaned up ${deletedCount} expired tokens`);
  } catch (error) {
    logger.error("Token cleanup error:", error);
  }
};

cleanupExpiredTokens();

setInterval(cleanupExpiredTokens, 24 * 60 * 60 * 1000);
