

import { io } from "socket.io-client";
import fs from "fs";

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhYWQxOTQ4N2JhNzA0YTVhYmFiMzIyOSIsImlhdCI6MTc5MTM2MTM5MCwiZXhwIjoxNzkxNDQ3NzkwfQ.gB8DWIDv7okfetPNkU5jRYPhwzF8t6GBRoEP2DKUS7E";

const interviewId = "6ac601bd692c6332063a05f8";

const audioFile = "./test-audio.webm";

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

  startAudioStreaming();
});

socket.on("transcript:partial", (data) => {
  console.log("✏️ Partial transcript:", data);
});

socket.on("transcript:final", (data) => {
  console.log("📝 Final transcript:", data);
});

socket.on("recording:stopped", (data) => {
  console.log("⏹️ Recording stopped:", data);

  setTimeout(() => {
    socket.disconnect();
  }, 1000);
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


function startAudioStreaming() {
  if (!fs.existsSync(audioFile)) {
    console.log(`❌ Audio file not found: ${audioFile}`);
    return;
  }

  console.log("🎧 Starting audio streaming...");

  const stream = fs.createReadStream(audioFile, {
    highWaterMark: 4096,
  });

  stream.on("data", (chunk) => {
    socket.emit("audio:chunk", chunk);
  });

  stream.on("end", () => {
    console.log("📤 Audio file completely streamed");

    setTimeout(() => {
      socket.emit("recording:stopped");

      console.log("📤 recording:stopped sent");
    }, 1000);
  });

  stream.on("error", (error) => {
    console.log("❌ Audio streaming error:", error);
  });
}












