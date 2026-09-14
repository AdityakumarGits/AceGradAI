import https from "https";

export const transcribeAudio = async (audioBuffer) => {
  try {
    console.log("🎤 Deepgram input:", {
      isBuffer: Buffer.isBuffer(audioBuffer),
      size: audioBuffer?.length,
      firstBytes: audioBuffer?.subarray(0, 4).toString("hex"),
    });

    const transcript = await new Promise((resolve, reject) => {
      const options = {
        hostname: "208.184.56.201",
        port: 443,

        path:
          "/v1/listen?model=nova-3&smart_format=true&language=en-US",

        method: "POST",

        headers: {
          Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
          "Content-Type": "audio/webm",
          "Content-Length": audioBuffer.length,
          Host: "api.deepgram.com",
        },

        // TLS SNI
        servername: "api.deepgram.com",

        timeout: 30000,
      };

      const request = https.request(options, (response) => {
        let body = "";

        response.on("data", (chunk) => {
          body += chunk;
        });

        response.on("end", () => {
          if (response.statusCode < 200 || response.statusCode >= 300) {
            console.error("❌ Deepgram HTTP Error:", {
              status: response.statusCode,
              body,
            });

            return reject(
              new Error(
                `Deepgram API returned status ${response.statusCode}`
              )
            );
          }

          try {
            const data = JSON.parse(body);

            const transcript =
              data?.results
                ?.channels?.[0]
                ?.alternatives?.[0]
                ?.transcript
                ?.trim();

            resolve(transcript || "");
          } catch (error) {
            reject(error);
          }
        });
      });

      request.on("timeout", () => {
        request.destroy();
        reject(new Error("Deepgram request timed out"));
      });

      request.on("error", (error) => {
        reject(error);
      });

      request.write(audioBuffer);
      request.end();
    });

    console.log("📝 Deepgram Transcript:", transcript);

    return transcript;
  } catch (error) {
    console.error("❌ Deepgram transcription failed");
    console.error("Message:", error?.message);
    console.error("Name:", error?.name);
    console.error("Status:", error?.statusCode);
    console.error("Cause:", error?.cause);

    throw error;
  }
};