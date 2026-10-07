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
  console.log("✅ interview:joined:", data);
});

socket.on("interview:started", (data) => {
  console.log("▶️ interview:started:", data);
});

socket.on("question:started", (data) => {
  console.log("❓ question:started:", data);
});

socket.on("question:next", (data) => {
  console.log("➡️ question:next:", data);
});

socket.on("transcript:partial", (data) => {
  console.log("✏️ transcript:partial:", data);
});

socket.on("transcript:final", (data) => {
  console.log("📝 transcript:final:", data);
});

socket.on("recording:started", (data) => {
  console.log("🎙️ recording:started:", data);
});

socket.on("recording:stopped", (data) => {
  console.log("🛑 recording:stopped:", data);
});

socket.on("interview:questions-completed", (data) => {
  console.log("🏁 questions completed:", data);
});

socket.on("interview:error", (data) => {
  console.log("❌ interview:error:", data);
});

socket.on("interview:replaced", (data) => {
  console.log("⚠️ interview:replaced:", data);
});

socket.on("connect_error", (error) => {
  console.log("❌ Connection rejected:", error.message);
});

socket.on("disconnect", (reason) => {
  console.log("🔌 Disconnected:", reason);
});