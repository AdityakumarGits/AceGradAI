import { useRef, useState,useEffect } from "react";

const TARGET_PHRASE = "i am ready to start the interview";

export function useMicTest() {
  const recognitionRef = useRef(null);
  const [micTesting, setMicTesting] = useState(false);
  const [micOk, setMicOk] = useState(false);
  const [heardText, setHeardText] = useState("");

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

      useEffect(() => {
    if (micOk) {
      onComplete?.();
    }
  }, [micOk, onComplete]);

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setMicTesting(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase().trim();
      setHeardText(transcript);
      if (transcript.includes(TARGET_PHRASE) || transcript.includes("ready")) {
        setMicOk(true);
      }
    };

    recognition.onerror = () => setMicTesting(false);
    recognition.onend = () => setMicTesting(false);

    recognitionRef.current = recognition;
    recognition.start();
  };

  return { micTesting, micOk, heardText, startListening };
}