import authRepo from "../repositories/sqlite/authRepo";

export const cleanupExpiredTokens = () => {
  try {
    const deletedCount = authRepo.tokenDeleteBlacklistRepo();
    console.log(`Cleaned up ${deletedCount} expired tokens`);
  } catch (error) {
    console.error("Token cleanup error:", error);
  }
};

setInterval(cleanupExpiredTokens, 24 * 60 * 60 * 1000);
cleanupExpiredTokens();
