import { io } from "socket.io-client";

const token = "YOUR_JWT_TOKEN";

const socket = io("http://localhost:5000", {
  auth: {
    token,
  },
});

socket.on("connect", () => {
  console.log("✅ Connected:", socket.id);
});

socket.on("connect_error", (error) => {
  console.log("❌ Connection rejected:", error.message);
});

socket.on("disconnect", (reason) => {
  console.log("🔌 Disconnected:", reason);
});