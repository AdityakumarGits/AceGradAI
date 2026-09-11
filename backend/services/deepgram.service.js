import { DeepgramClient } from "@deepgram/sdk";

const deepgram = new DeepgramClient({
  apiKey: process.env.DEEPGRAM_API_KEY,
});

export const transcribeAudio = async (audioBuffer) => {
  const response = await deepgram.listen.v1.media.transcribeFile(
    audioBuffer,
    {
     model: "nova-3",
    smart_format: true,
    language: "en-US",
    }
  );

  const transcript = response?.results
    ?.channels?.[0]
    ?.alternatives?.[0]
    ?.transcript
    ?.trim();

  return transcript;
};