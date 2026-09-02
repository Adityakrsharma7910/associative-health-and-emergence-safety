import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { createApp } from "./server/app.js";

const PORT = 3000;

async function startServer() {
  const app = createApp();

  // Vite middleware for dev or static dist for prod
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SafeGuard AI] Secure server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start SafeGuard AI server:", err);
});
