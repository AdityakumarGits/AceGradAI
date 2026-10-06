import Interview from "../model/interview.model.js";

import {
  getSession,
  createSession,
  cleanupSession,
  updateInterviewState,
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

  socket.on("recording:started", (data = {}) => {
    try {
      const interviewId = socket.data.interviewId;

      if (!interviewId) {
        return socket.emit("interview:error", {
          message: "No active interview session",
        });
      }

      const session = getSession(interviewId);

      // Session + socket validation
      if (!session || session.activeSocketId !== socket.id) {
        return socket.emit("interview:error", {
          message: "Invalid or expired interview session",
        });
      }

      // Interview lifecycle validation
      if (session.interviewState !== "started") {
        return socket.emit("interview:error", {
          message: "Interview is not active",
        });
      }

      // Recording state validation
      if (session.recordingState === "recording") {
        return socket.emit("interview:error", {
          message: "Recording is already active",
        });
      }

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
  // RECORDING STOPPED
  // ==========================================

  socket.on("recording:stopped", (data = {}) => {
    try {
      const interviewId = socket.data.interviewId;

      if (!interviewId) {
        return socket.emit("interview:error", {
          message: "No active interview session",
        });
      }

      const session = getSession(interviewId);

      // Session + socket validation
      if (!session || session.activeSocketId !== socket.id) {
        return socket.emit("interview:error", {
          message: "Invalid or expired interview session",
        });
      }

      // Recording state validation
      if (session.recordingState !== "recording") {
        return socket.emit("interview:error", {
          message: "Recording is not active",
        });
      }

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

      // Session + socket validation
      if (!session || session.activeSocketId !== socket.id) {
        return socket.emit("interview:error", {
          message: "Invalid or expired interview session",
        });
      }

      // Cannot complete while recording
      if (session.recordingState === "recording") {
        return socket.emit("interview:error", {
          message: "Stop recording before completing the interview",
        });
      }

      // Update lifecycle state
      updateInterviewState(interviewId, "completed");

      socket.emit("interview:completed", {
        interviewId,
        status: "completed",
      });

      console.log("✅ Interview completed:", {
        interviewId,
        socketId: socket.id,
      });

      // Cleanup session
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