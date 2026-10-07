import Interview from "../model/interview.model.js";
import { createDeepgramConnection } from "../services/deepgramStreaming.service.js";

import {
  getSession,
  createSession,
  cleanupSession,
  updateInterviewState,
  isSessionActive,
} from "./session.manager.js";

export const registerInterviewSocket = (io, socket) => {

  // ==========================================
  // JOIN INTERVIEW
  // ==========================================

  socket.on("join-interview", async (interviewId) => {
    try {
      if (!interviewId) {
        return socket.emit("interview:error", {
          message: "Interview ID is required",
        });
      }

      const interview = await Interview.findOne({
        _id: interviewId,
        userId: socket.user.id,
      });

      if (!interview) {
        return socket.emit("interview:error", {
          message: "Interview not found or unauthorized access",
        });
      }

      // ==========================================
      // SINGLE ACTIVE SESSION
      // ==========================================

      const existingSession = getSession(interviewId);

      if (existingSession) {
        const oldSocket = io.sockets.sockets.get(
          existingSession.activeSocketId,
        );

        if (oldSocket) {
          oldSocket.emit("interview:replaced", {
            message:
              "Interview opened in another tab. This session has been transferred to the newer tab.",
          });
        }

        cleanupSession(interviewId);

        if (oldSocket) {
          oldSocket.disconnect(true);
        }
      }

      // ==========================================
      // CREATE NEW SESSION
      // ==========================================

      const session = createSession({
        interviewId,
        userId: socket.user.id,
        socketId: socket.id,
      });

      socket.data.interviewId = interviewId;

      socket.join(`interview:${interviewId}`);

      console.log("👤 Interview session created:", {
        interviewId,
        userId: socket.user.id,
        socketId: socket.id,
        generation: session.generation,
      });

      // ==========================================
      // INTERVIEW STARTED
      // ==========================================

      socket.emit("interview:joined", {
        interviewId,
      });

      socket.emit("interview:started", {
        interviewId,
        status: "started",
      });

      // ==========================================
      // FIRST QUESTION
      // ==========================================

      socket.emit("question:started", {
        interviewId,
        questionNumber: 1,
      });

    } catch (error) {
      console.error("❌ Interview socket error:", error);

      socket.emit("interview:error", {
        message: "Unable to join interview",
      });
    }
  });


  // ==========================================
  // RECORDING STARTED
  // ==========================================

  socket.on("recording:started", async (data = {}) => {
    try {
      const interviewId = socket.data.interviewId;

      if (!interviewId) {
        return socket.emit("interview:error", {
          message: "No active interview session",
        });
      }

      const session = getSession(interviewId);

      if (!session || session.activeSocketId !== socket.id) {
        return socket.emit("interview:error", {
          message: "Invalid or expired interview session",
        });
      }

      if (session.interviewState !== "started") {
        return socket.emit("interview:error", {
          message: "Interview is not active",
        });
      }

      if (session.recordingState === "recording") {
        return socket.emit("interview:error", {
          message: "Recording is already active",
        });
      }

      // ==========================================
      // SAVE CURRENT GENERATION
      // ==========================================

      const generation = session.generation;

      // ==========================================
      // CREATE DEEPGRAM CONNECTION
      // ==========================================

      const connection = await createDeepgramConnection({
        socket,

        onError: (error) => {
          if (!isSessionActive(interviewId, generation)) {
            return;
          }

          console.error(
            "❌ Deepgram error for interview:",
            interviewId,
            error?.message || error,
          );

          socket.emit("interview:error", {
            message: "Speech recognition connection failed",
          });

          cleanupSession(interviewId);

          socket.data.interviewId = null;
        },

        onClose: () => {
          if (!isSessionActive(interviewId, generation)) {
            return;
          }

          const currentSession = getSession(interviewId);

          if (!currentSession) {
            return;
          }

          currentSession.deepgramConnection = null;

          console.log("🔌 Deepgram connection closed:", {
            interviewId,
            socketId: socket.id,
          });
        },
      });

      // ==========================================
      // SESSION MAY HAVE BEEN REPLACED
      // ==========================================

      if (!isSessionActive(interviewId, generation)) {
        try {
          connection.finish();
        } catch (error) {
          console.error(
            "❌ Error closing stale Deepgram connection:",
            error.message,
          );
        }

        return;
      }

      // ==========================================
      // SAVE DEEPGRAM CONNECTION
      // ==========================================

      session.deepgramConnection = connection;
      session.recordingState = "recording";

      socket.emit("recording:started", {
        interviewId,
        questionNumber: data.questionNumber ?? null,
        status: "recording",
      });

      console.log("🎙️ Recording started:", {
        interviewId,
        socketId: socket.id,
        questionNumber: data.questionNumber ?? null,
      });

    } catch (error) {
      console.error("❌ Recording start error:", error);

      socket.emit("interview:error", {
        message: "Unable to start recording",
      });
    }
  });


  // ==========================================
  // AUDIO CHUNK
  // ==========================================

  socket.on("audio:chunk", (audioChunk) => {
    try {
      const interviewId = socket.data.interviewId;

      if (!interviewId) {
        return socket.emit("interview:error", {
          message: "No active interview session",
        });
      }

      const session = getSession(interviewId);

      if (!session || session.activeSocketId !== socket.id) {
        return socket.emit("interview:error", {
          message: "Invalid or expired interview session",
        });
      }

      if (session.recordingState !== "recording") {
        return socket.emit("interview:error", {
          message: "Recording is not active",
        });
      }

      if (!session.deepgramConnection) {
        return socket.emit("interview:error", {
          message: "Deepgram connection is not available",
        });
      }

      if (!audioChunk) {
        return;
      }

      session.deepgramConnection.sendMedia(audioChunk);

    } catch (error) {
      console.error("❌ Audio chunk error:", error);

      socket.emit("interview:error", {
        message: "Unable to process audio chunk",
      });
    }
  });


  // ==========================================
  // RECORDING STOPPED
  // ==========================================

  socket.on("recording:stopped", async (data = {}) => {
    try {
      const interviewId = socket.data.interviewId;

      if (!interviewId) {
        return socket.emit("interview:error", {
          message: "No active interview session",
        });
      }

      const session = getSession(interviewId);

      if (!session || session.activeSocketId !== socket.id) {
        return socket.emit("interview:error", {
          message: "Invalid or expired interview session",
        });
      }

      if (session.recordingState !== "recording") {
        return socket.emit("interview:error", {
          message: "Recording is not active",
        });
      }

      if (!session.deepgramConnection) {
        return socket.emit("interview:error", {
          message: "Deepgram connection is not available",
        });
      }

      // ==========================================
      // SAVE CURRENT GENERATION
      // ==========================================

      const generation = session.generation;
      const connection = session.deepgramConnection;

      // ==========================================
      // FINALIZE DEEPGRAM
      // ==========================================

      connection.sendFinalize();

      console.log("⏳ Deepgram finalizing:", {
        interviewId,
        questionNumber: data.questionNumber ?? null,
      });

      // ==========================================
      // CLOSE AFTER FINAL TRANSCRIPT
      // ==========================================

      setTimeout(() => {
        if (!isSessionActive(interviewId, generation)) {
          return;
        }

        if (session.deepgramConnection !== connection) {
          return;
        }

        try {
          connection.sendCloseStream();
        } catch (error) {
          console.error(
            "❌ Error closing Deepgram stream:",
            error.message,
          );
        }

        session.deepgramConnection = null;
        session.recordingState = "idle";

        socket.emit("recording:stopped", {
          interviewId,
          questionNumber: data.questionNumber ?? null,
          status: "stopped",
        });

        console.log("⏹️ Recording stopped:", {
          interviewId,
          socketId: socket.id,
          questionNumber: data.questionNumber ?? null,
        });

      }, 500);

    } catch (error) {
      console.error("❌ Recording stop error:", error);

      socket.emit("interview:error", {
        message: "Unable to stop recording",
      });
    }
  });


  // ==========================================
  // INTERVIEW COMPLETED
  // ==========================================

  socket.on("interview:completed", () => {
    try {
      const interviewId = socket.data.interviewId;

      if (!interviewId) {
        return socket.emit("interview:error", {
          message: "No active interview session",
        });
      }

      const session = getSession(interviewId);

      // ==========================================
      // SESSION + SOCKET VALIDATION
      // ==========================================

      if (!session || session.activeSocketId !== socket.id) {
        return socket.emit("interview:error", {
          message: "Invalid or expired interview session",
        });
      }

      // ==========================================
      // CANNOT COMPLETE WHILE RECORDING
      // ==========================================

      if (session.recordingState === "recording") {
        return socket.emit("interview:error", {
          message: "Stop recording before completing the interview",
        });
      }

      // ==========================================
      // UPDATE INTERVIEW STATE
      // ==========================================

      updateInterviewState(interviewId, "completed");

      socket.emit("interview:completed", {
        interviewId,
        status: "completed",
      });

      console.log("✅ Interview completed:", {
        interviewId,
        socketId: socket.id,
      });

      // ==========================================
      // CLEANUP SESSION
      // ==========================================

      cleanupSession(interviewId);

      socket.data.interviewId = null;

    } catch (error) {
      console.error("❌ Interview completion error:", error);

      socket.emit("interview:error", {
        message: "Unable to complete interview",
      });
    }
  });
};