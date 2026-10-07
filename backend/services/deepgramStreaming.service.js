import deepgram from "./deepgram.service.js";

export const createDeepgramConnection = async ({
  socket,
  onError,
  onClose,
  onFinalTranscript,
}) => {
  try {
    const connection = await deepgram.listen.v1.connect({
      model: "nova-3",
      language: "en-US",
      smart_format: "true",
      interim_results: "true",
    });

    connection.on("open", () => {
      console.log("🎙️ Deepgram streaming connection opened");
    });

    connection.on("message", (data) => {
      if (data?.type !== "Results") {
        return;
      }

      const transcript =
        data?.channel?.alternatives?.[0]?.transcript?.trim() || "";

      if (!transcript) {
        return;
      }

      if (data?.is_final) {
        socket.emit("transcript:final", {
          transcript,
        });

        console.log("📝 Final transcript:", transcript);

        if (onFinalTranscript) {
          onFinalTranscript(transcript);
        }
      } else {
        socket.emit("transcript:partial", {
          transcript,
        });

        console.log("✏️ Partial transcript:", transcript);
      }
    });

    connection.on("error", (error) => {
      console.error(
        "❌ Deepgram streaming error:",
        error?.message || error,
      );

      if (onError) {
        onError(error);
      }
    });

    connection.on("close", () => {
      console.log("🔌 Deepgram streaming connection closed");

      if (onClose) {
        onClose();
      }
    });

    connection.connect();

    await connection.waitForOpen();

    console.log("✅ Deepgram streaming connection ready");

    return connection;
  } catch (error) {
    console.error(
      "❌ Failed to create Deepgram streaming connection:",
      error?.message || error,
    );

    throw error;
  }
};