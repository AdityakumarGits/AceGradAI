import { io } from "socket.io-client";

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhYWQxOTQ4N2JhNzA0YTVhYmFiMzIyOSIsImlhdCI6MTc5MTM2MTM5MCwiZXhwIjoxNzkxNDQ3NzkwfQ.gB8DWIDv7okfetPNkU5jRYPhwzF8t6GBRoEP2DKUS7E";

const interviewId = "6ac601bd692c6332063a05f8";

const socket = io("http://localhost:5000", {
  auth: {
    token,
  },
});

socket.on("connect", () => {
  console.log("✅ Connected:", socket.id);

  socket.emit("join-interview", interviewId);

  console.log("📤 join-interview sent:", interviewId);
});

socket.on("interview:joined", (data) => {
  console.log("✅ Interview joined:", data);

  // Phase 3 test
  socket.emit("recording:started");

  console.log("📤 recording:started sent");
});

socket.on("interview:started", (data) => {
  console.log("▶️ Interview started:", data);
});

socket.on("question:started", (data) => {
  console.log("❓ Question started:", data);
});

socket.on("recording:started", (data) => {
  console.log("🎙️ Recording started:", data);
});

socket.on("interview:error", (data) => {
  console.log("❌ Interview error:", data);
});

socket.on("interview:replaced", (data) => {
  console.log("⚠️ Interview replaced:", data);
});

socket.on("connect_error", (error) => {
  console.log("❌ Connection rejected:", error.message);
});

socket.on("disconnect", (reason) => {
  console.log("🔌 Disconnected:", reason);
});