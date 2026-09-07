import * as sdk from "microsoft-cognitiveservices-speech-sdk";

const speechKey = process.env.AZURE_SPEECH_KEY;
const speechRegion = process.env.AZURE_SPEECH_REGION;

if (!speechKey) {
  throw new Error("AZURE_SPEECH_KEY is not configured");
}

if (!speechRegion) {
  throw new Error("AZURE_SPEECH_REGION is not configured");
}

const speechConfig = sdk.SpeechConfig.fromSubscription(
  speechKey,
  speechRegion
);

speechConfig.speechSynthesisLanguage = "en-US";

speechConfig.speechSynthesisVoiceName =
  "en-US-AvaMultilingualNeural";

speechConfig.speechSynthesisOutputFormat =
  sdk.SpeechSynthesisOutputFormat.Riff24Khz16BitMonoPcm;

export { sdk, speechConfig };