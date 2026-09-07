import { sdk, speechConfig } from "../config/azure.config.js";

export const synthesizeSpeech = async (text) => {
  if (!text?.trim()) {
    throw new Error("Text is required for speech generation");
  }

  const synthesizer = new sdk.SpeechSynthesizer(
    speechConfig,
    null
  );

  try {
    const result = await new Promise((resolve, reject) => {
      synthesizer.speakTextAsync(
        text.trim(),
        (speechResult) => resolve(speechResult),
        (error) => reject(error)
      );
    });

    if (
      result.reason !==
      sdk.ResultReason.SynthesizingAudioCompleted
    ) {
      throw new Error(
        result.errorDetails ||
          "Azure Speech synthesis failed"
      );
    }

    return result.audioData;
  } finally {
    synthesizer.close();
  }
};