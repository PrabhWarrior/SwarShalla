import app, { initApp } from "./app";
import logger from "./utils/logger";

const PORT = process.env.PORT || 3000;

async function startServer() {
  await initApp();

  app.listen(PORT, () => {
    logger.info(`🚀 Server running on http://localhost:${PORT}`);
  });
}

startServer();
