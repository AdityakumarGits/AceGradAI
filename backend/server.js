import dotenv from "dotenv";

dotenv.config();

import http from "http";
import { Server } from "socket.io";

import connectDB from "./config/db.js";
import app from "./app.js";

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// ==========================================
// SOCKET.IO
// ==========================================

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("🔌 WebSocket connected:", socket.id);

  socket.on("join-interview", (interviewId) => {
    socket.join(`interview:${interviewId}`);

    console.log(`👤 Joined interview room: ${interviewId}`);
  });

  socket.on("disconnect", () => {
    console.log("🔌 WebSocket disconnected:", socket.id);
  });
});

// ==========================================
// START SERVER
// ==========================================

const startServer = async () => {
  try {
    await connectDB();

    server.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 AceGrad AI server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

export { io };