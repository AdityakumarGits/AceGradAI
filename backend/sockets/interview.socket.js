import Interview from "../model/interview.model.js";

import {
  getSession,
  createSession,
  cleanupSession,
} from "./session.manager.js";

export const registerInterviewSocket = (io, socket) => {
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

      socket.emit("interview:joined", {
        interviewId,
      });
    } catch (error) {
      console.error("❌ Interview socket error:", error);

      socket.emit("interview:error", {
        message: "Unable to join interview",
      });
    }
  });
};