import dotenv from "dotenv";
dotenv.config();
import { authenticateSocket } from "./sockets/socket.js";
import { registerInterviewSocket } from "./sockets/interview.socket.js";
import { getSession, cleanupSession,} from "./sockets/session.manager.js";



import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import app from "./app.js";


const PORT = process.env.PORT || 5000;
const server = http.createServer(app);


// SOCKET.IO

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.use(authenticateSocket);

io.on("connection", (socket) => {
  console.log(
    "🔌 Authenticated WebSocket connected:",
    socket.id,
  );

  console.log(
    "👤 Socket user:",
    socket.user.id,
  );

  registerInterviewSocket(io, socket);

  socket.on("disconnect", () => {
    console.log(
      "🔌 WebSocket disconnected:",
      socket.id,
    );

    const interviewId = socket.data.interviewId;

    // Socket kisi interview session se associated nahi tha
    if (!interviewId) {
      return;
    }

    const session = getSession(interviewId);

    // Session already removed
    if (!session) {
      return;
    }

    // ------------------------------------------
    // IMPORTANT:
    // Old/replaced socket must NOT clean
    // the new socket's session.
    // ------------------------------------------

    if (session.activeSocketId !== socket.id) {
      console.log(
        "⚠️ Ignoring stale socket disconnect:",
        socket.id,
      );

      return;
    }

    cleanupSession(interviewId);
  });
});

// ==========================================
// START SERVER
// ==========================================

const startServer = async () => {
  try {
    await connectDB();

    server.listen(PORT, "0.0.0.0", () => {
      console.log(
        `🚀 AceGrad AI server running on port ${PORT}`,
      );
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

export { io };