import app, { initApp } from "./app";

const PORT = process.env.PORT || 3000;

async function startServer() {
  await initApp();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

startServer();
