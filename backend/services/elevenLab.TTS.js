// import { ElevenLabsClient, stream } from "@elevenlabs/elevenlabs-js";
// import generateNextQuestion from "./gemini.service"
// import { Readable } from "stream";

// const elevenlabs = new ElevenLabsClient();

// export const testtoSpeech= async()=> {
//   const audioStream = await elevenlabs.textToSpeech.stream("generateNextQuestion", {
//     text: "This is a test",
//     modelId: "eleven_v3",
//   });
//   // option 1: play the streamed audio locally
//   await stream(Readable.from(audioStream));
//   // option 2: process the audio manually
//   for await (const chunk of audioStream) {
//     console.log(chunk);
//   }
// }
// testtoSpeech();
import { ElevenLabsClient, play } from '@elevenlabs/elevenlabs-js';

const elevenlabs = new ElevenLabsClient({
    apiKey: "ELEVENLABS_API_KEY", // Defaults to process.env.ELEVENLABS_API_KEY
});

const audio = await elevenlabs.textToSpeech.convert(
  'JBFqnCBsd6RMkjVDRZzb', // voice_id
  {
    text: 'generateNextQuestion',
    modelId: 'eleven_multilingual_v2',
    outputFormat: 'mp3_44100_128', // output_format
  }
);

await play(audio);