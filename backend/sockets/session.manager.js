const sessions = new Map();

let generationCounter = 0;

const createGeneration = () => {
  generationCounter += 1;

  return generationCounter;
};

export const getSession = (interviewId) => {
  return sessions.get(interviewId);
};

export const createSession = ({
  interviewId,
  userId,
  socketId,
}) => {
  const session = {
    interviewId,
    userId,
    activeSocketId: socketId,

    // Interview lifecycle
    interviewState: "started",

    // Recording lifecycle
    recordingState: "idle",

    // Future Deepgram streaming connection
    deepgramConnection: null,

    // Cleanup protection
    isCleanedUp: false,

    // Async operation protection
    generation: createGeneration(),
  };

  sessions.set(interviewId, session);

  return session;
};

export const isSessionActive = (
  interviewId,
  generation,
) => {
  const session = sessions.get(interviewId);

  if (!session) {
    return false;
  }

  if (session.isCleanedUp) {
    return false;
  }

  if (session.generation !== generation) {
    return false;
  }

  return true;
};

export const isValidInterviewState = (
  interviewId,
  expectedState,
) => {
  const session = sessions.get(interviewId);

  if (!session || session.isCleanedUp) {
    return false;
  }

  return session.interviewState === expectedState;
};

export const updateInterviewState = (
  interviewId,
  state,
) => {
  const session = sessions.get(interviewId);

  if (!session || session.isCleanedUp) {
    return false;
  }

  session.interviewState = state;

  return true;
};

export const cleanupSession = (interviewId) => {
  const session = sessions.get(interviewId);

  if (!session || session.isCleanedUp) {
    return;
  }

  session.isCleanedUp = true;

  // Invalidate any async operations
  session.generation += 1;

  if (session.deepgramConnection) {
    try {
      session.deepgramConnection.finish();
    } catch (error) {
      console.error(
        "❌ Error closing Deepgram connection:",
        error.message,
      );
    }

    session.deepgramConnection = null;
  }

  sessions.delete(interviewId);

  console.log("🧹 Interview session cleaned:", {
    interviewId,
    userId: session.userId,
    socketId: session.activeSocketId,
  });
};

export const getAllSessions = () => {
  return sessions;
};