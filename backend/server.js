import dotenv from "dotenv";

dotenv.config();

import http from "http";
import connectDB from "./config/db.js";
import app from "./app.js";

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const startServer = async () => {
  try {
    await connectDB();

    server.listen(PORT, () => {
      console.log(`🚀 AceGrad AI server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();