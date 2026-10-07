import Interview from "../model/interview.model.js";

import { createDeepgramConnection } from "../services/deepgramStreaming.service.js";

import {
  getSession,
  createSession,
  cleanupSession,
  updateInterviewState,
  isSessionActive,
} from "./session.manager.js";

// ==========================================
// PROCESS INTERVIEW ANSWER
// ==========================================

const processInterviewAnswer = async ({
  socket,
  interviewId,
  session,
  transcript,
  connection,
}) => {
  try {
    session.answerProcessing = true;

    const interview = await Interview.findOne({
      _id: interviewId,
      userId: socket.user.id,
    });

    if (!interview) {
      socket.emit("interview:error", {
        message: "Interview not found or unauthorized access",
      });

      return;
    }

    if (interview.status !== "active") {
      socket.emit("interview:error", {
        message: "Interview session is not active",
      });

      return;
    }

    const questionIndex = interview.answers.length;

    const questionText = interview.questions[questionIndex];

    if (!questionText) {
      socket.emit("interview:error", {
        message: "Invalid question sequence",
      });

      return;
    }

    const alreadyAnswered = interview.answers.some(
      (answer) => answer.questionIndex === questionIndex,
    );

    if (alreadyAnswered) {
      console.log(
        "⚠️ Question already answered:",
        questionIndex,
      );

      return;
    }

    interview.answers.push({
      questionIndex,
      questionText,
      userAnswer: transcript.trim(),
    });

    await interview.save();

    console.log("💾 Answer saved:", {
      interviewId,
      questionIndex,
      answersCount: interview.answers.length,
      hasAnswer: Boolean(transcript.trim()),
    });

    // ==========================================
    // CLOSE DEEPGRAM CONNECTION
    // ==========================================

    if (connection) {
      try {
        connection.sendCloseStream();
      } catch (error) {
        console.error(
          "❌ Error closing Deepgram stream:",
          error.message,
        );
      }
    }

    if (
      connection &&
      session.deepgramConnection === connection
    ) {
      session.deepgramConnection = null;
    }

    // ==========================================
    // RESET RECORDING STATE
    // ==========================================

    session.recordingState = "idle";
    session.audioReceived = false;

    socket.emit("recording:stopped", {
      interviewId,
      questionNumber: questionIndex + 1,
      status: "stopped",
    });

    // ==========================================
    // NEXT QUESTION
    // ==========================================

    const nextQuestionIndex = questionIndex + 1;

    if (nextQuestionIndex < interview.questions.length) {
      const nextQuestion =
        interview.questions[nextQuestionIndex];

      session.currentQuestionIndex = nextQuestionIndex;

      socket.emit("question:next", {
        interviewId,
        questionIndex: nextQuestionIndex,
        questionNumber: nextQuestionIndex + 1,
        question: nextQuestion,
      });

      socket.emit("question:started", {
        interviewId,
        questionNumber: nextQuestionIndex + 1,
      });

      console.log("➡️ Next question:", {
        interviewId,
        questionNumber: nextQuestionIndex + 1,
      });
    } else {
      // ==========================================
      // ALL QUESTIONS COMPLETED
      // ==========================================

      session.interviewState = "questions-completed";

      socket.emit("interview:questions-completed", {
        interviewId,
        totalQuestions: interview.questions.length,
        totalAnswers: interview.answers.length,
      });

      console.log("🏁 All interview questions completed:", {
        interviewId,
        totalQuestions: interview.questions.length,
        totalAnswers: interview.answers.length,
      });
    }
  } catch (error) {
    console.error(
      "❌ Answer processing error:",
      error,
    );

    socket.emit("interview:error", {
      message: "Unable to process answer",
    });
  } finally {
    const currentSession = getSession(interviewId);

    if (currentSession) {
      currentSession.answerProcessing = false;
    }
  }
};

// ==========================================
// REGISTER INTERVIEW SOCKET
// ==========================================

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
      console.error(
        "❌ Interview socket error:",
        error,
      );

      socket.emit("interview:error", {
        message: "Unable to join interview",
      });
    }
  });

  // ==========================================
  // RECORDING STARTED
  // ==========================================

  socket.on("recording:started", async () => {
    try {
      const interviewId = socket.data.interviewId;

      if (!interviewId) {
        return socket.emit("interview:error", {
          message: "No active interview session",
        });
      }

      const session = getSession(interviewId);

      if (
        !session ||
        session.activeSocketId !== socket.id
      ) {
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

      if (session.answerProcessing) {
        return socket.emit("interview:error", {
          message: "Previous answer is still being processed",
        });
      }

      const generation = session.generation;

      const connection = await createDeepgramConnection({
        socket,

        // ==========================================
        // DEEPGRAM ERROR
        // ==========================================

        onError: (error) => {
          if (!isSessionActive(interviewId, generation)) {
            try {
              connection.sendCloseStream();
            } catch (error) {
              console.error(
                "❌ Error closing stale Deepgram connection:",
                error.message,
              );
            }

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

        // ==========================================
        // DEEPGRAM CLOSE
        // ==========================================

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

        // ==========================================
        // FINAL TRANSCRIPT
        // ==========================================

        onFinalTranscript: async (transcript) => {
          const session = getSession(interviewId);

          try {
            if (!isSessionActive(interviewId, generation)) {
              return;
            }

            if (!session) {
              return;
            }

            if (session.answerProcessing) {
              console.log(
                "⚠️ Answer already processing",
              );

              return;
            }

            await processInterviewAnswer({
              socket,
              interviewId,
              session,
              transcript,
              connection,
            });
          } catch (error) {
            console.error(
              "❌ Final transcript processing error:",
              error,
            );

            socket.emit("interview:error", {
              message: "Unable to process final transcript",
            });
          }
        },
      });

      // ==========================================
      // STALE CONNECTION PROTECTION
      // ==========================================

      if (!isSessionActive(interviewId, generation)) {
        try {
          connection.sendCloseStream();
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

      // IMPORTANT:
      // Reset for every new question
      session.audioReceived = false;

      socket.emit("recording:started", {
        interviewId,
      });
    } catch (error) {
      console.error(
        "❌ Recording start error:",
        error,
      );

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

      if (
        !session ||
        session.activeSocketId !== socket.id
      ) {
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

      // IMPORTANT:
      // At least one audio chunk received
      session.audioReceived = true;

      session.deepgramConnection.sendMedia(audioChunk);
    } catch (error) {
      console.error(
        "❌ Audio chunk error:",
        error,
      );

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

      if (
        !session ||
        session.activeSocketId !== socket.id
      ) {
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
      // NO AUDIO ANSWER
      // ==========================================

      if (!session.audioReceived) {
        console.log(
          "ℹ️ No audio detected. Saving empty answer.",
        );

        await processInterviewAnswer({
          socket,
          interviewId,
          session,
          transcript: "",
          connection,
        });

        return;
      }

      // ==========================================
      // FINALIZE DEEPGRAM
      // ==========================================

      connection.sendFinalize();

      console.log("🎙️ Deepgram finalizing:", {
        interviewId,
        questionNumber: data.questionNumber ?? null,
      });
    } catch (error) {
      console.error(
        "❌ Recording stop error:",
        error,
      );

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

      if (
        !session ||
        session.activeSocketId !== socket.id
      ) {
        return socket.emit("interview:error", {
          message: "Invalid or expired interview session",
        });
      }

      // ==========================================
      // CANNOT COMPLETE WHILE RECORDING
      // ==========================================

      if (session.recordingState === "recording") {
        return socket.emit("interview:error", {
          message:
            "Stop recording before completing the interview",
        });
      }

      if (session.answerProcessing) {
        return socket.emit("interview:error", {
          message:
            "Previous answer is still being processed",
        });
      }

      // ==========================================
      // UPDATE INTERVIEW STATE
      // ==========================================

      updateInterviewState(
        interviewId,
        "completed",
      );

      socket.emit("interview:completed", {
        interviewId,
        status: "completed",
      });

      console.log("🏁 Interview completed:", {
        interviewId,
        socketId: socket.id,
      });

      // ==========================================
      // CLEANUP SESSION
      // ==========================================

      cleanupSession(interviewId);

      socket.data.interviewId = null;
    } catch (error) {
      console.error(
        "❌ Interview completion error:",
        error,
      );

      socket.emit("interview:error", {
        message: "Unable to complete interview",
      });
    }
  });
};