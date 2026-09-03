import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import InterviewerPanel from "./InterviewerPanel";
import InterviewTopBar from "./InterviewTopBar";
import CameraSection from "./CameraSection";
import EvaluationPanel from "./EvaluationPanel";
import InterviewControlBar from "./InterviewControlBar";

import API from "../../services/api";

const WELCOME_TEXT =
  "Hello, I'm Mira, your AI interviewer. Let's get started with your interview.";

const ACTIVE_INTERVIEW_KEY = "acegrad_active_interview_id";

export default function StartInterview() {
  const location = useLocation();
  const navigate = useNavigate();

  // =========================================================
  // INTERVIEW CONFIG
  // =========================================================

  const {
    questionsSources,
    jobTitle,
    jobDescription,
    topics,
    resumeFile,
    experienceLevel,
  } = location.state || {};

  // =========================================================
  // STATE
  // =========================================================

  const [interviewID, setInterviewID] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [loadingDisplayQuestion, setLoadingDisplayQuestion] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [evaluation, setEvaluation] = useState(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // =========================================================
  // REFS
  // =========================================================

  const mediaStreamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioElementRef = useRef(null);
  const audioUrlRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const hasStartedRecordingRef = useRef(false);
  const isSubmittingRef = useRef(false);
  const interviewStartedRef = useRef(false);
  const hasWelcomedRef = useRef(false);
  const isUnmountingRef = useRef(false);

  // Prevent recovery API from running multiple times
  const recoveryStartedRef = useRef(false);
  // Prevent online event from triggering multiple recoveries
  const reconnectingRef = useRef(false);
useEffect(() => {
  return () => {
    isUnmountingRef.current = true;

    stopSilenceDetection();

    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
    }

    if (audioElementRef.current) {
      audioElementRef.current.pause();

      audioElementRef.current.onended = null;
      audioElementRef.current.onerror = null;
      audioElementRef.current.onabort = null;

      audioElementRef.current = null;
    }

    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    // ACTIVE_INTERVIEW_KEY intentionally clear mat karna
  };
}, []);
  // =========================================================
  // CONSTANTS
  // =========================================================

  const SILENCE_DURATION = 4000;
  const SILENCE_THRESHOLD = 0.015;

  // =========================================================
  // HELPER — SAVE ACTIVE INTERVIEW
  // =========================================================

  const saveActiveInterview = (id) => {
    if (!id) return;
    sessionStorage.setItem(ACTIVE_INTERVIEW_KEY, id);
    console.log("💾 Active interview saved:", id);
  };

  // =========================================================
  // HELPER — CLEAR ACTIVE INTERVIEW
  // =========================================================

  const clearActiveInterview = () => {
    sessionStorage.removeItem(ACTIVE_INTERVIEW_KEY);
    console.log("🧹 Active interview session cleared.");
  };

  // =========================================================
  // HELPER — FIND NEXT UNANSWERED QUESTION
  // =========================================================

  const getNextUnansweredQuestionIndex = (
    interviewQuestions,
    interviewAnswers,
  ) => {
    if (!Array.isArray(interviewQuestions) || interviewQuestions.length === 0) {
      return 0;
    }
    const answeredIndexes = new Set(
      (Array.isArray(interviewAnswers) ? interviewAnswers : [])
        .map((answer) => Number(answer.questionIndex))
        .filter((index) => Number.isFinite(index)),
    );
    const nextIndex = interviewQuestions.findIndex(
      (_, index) => !answeredIndexes.has(index),
    );

    // All questions are already answered
    if (nextIndex === -1) {
      return interviewQuestions.length;
    }
    return nextIndex;
  };

  // =========================================================
  // RECOVER INTERVIEW FROM BACKEND
  // =========================================================

  const recoverInterview = async (savedInterviewID) => {
    if (!savedInterviewID) {
      return false;
    }

    if (recoveryStartedRef.current) {
      return false;
    }

    recoveryStartedRef.current = true;

    setLoadingDisplayQuestion(true);
    setErrorMsg(null);

    try {
      console.log("♻️ Recovering interview:", savedInterviewID);

      const response = await API.get(
        `/interview/getInterviewDetails/${savedInterviewID}`,
      );

      console.log("♻️ Recovery response:", response?.data);

      const interview = response?.data?.data?.interview;

      if (!interview?._id) {
        throw new Error("Interview session could not be recovered.");
      }

      // -------------------------------------------------------
      // COMPLETED INTERVIEW
      // -------------------------------------------------------

      if (interview.status === "completed") {
        console.log("✅ Recovered interview is already completed.");

        setInterviewID(interview._id);
        setQuestions(
          Array.isArray(interview.questions) ? interview.questions : [],
        );

        setEvaluation(interview.evaluation || null);
        setIsComplete(true);

        clearActiveInterview();

        return true;
      }

      // -------------------------------------------------------
      // ABANDONED INTERVIEW
      // -------------------------------------------------------

      if (interview.status === "abandoned") {
        console.log("⚠️ Recovered interview is abandoned.");

        clearActiveInterview();

        setErrorMsg(
          "This interview session is no longer active. Please start a new interview.",
        );

        return false;
      }

      // -------------------------------------------------------
      // INVALID STATUS
      // -------------------------------------------------------

     if (interview.status !== "active") {
  throw new Error(
    `This interview session cannot be recovered. Current status: ${interview.status}`
  );
}

     // -------------------------------------------------------
// RESTORE INTERVIEW
// -------------------------------------------------------

const recoveredQuestions = Array.isArray(interview.questions)
  ? interview.questions
  : [];

const recoveredAnswers = Array.isArray(interview.answers)
  ? interview.answers
  : [];

if (recoveredQuestions.length === 0) {
  throw new Error("Interview questions could not be recovered.");
}

// Find the first question that has not been answered yet
const nextQuestionIndex = getNextUnansweredQuestionIndex(
  recoveredQuestions,
  recoveredAnswers
);

// -------------------------------------------------------
// ALL QUESTIONS ALREADY ANSWERED
// -------------------------------------------------------

if (nextQuestionIndex >= recoveredQuestions.length) {
  console.log("✅ All questions were already answered.");

  const response = await API.post("/interview/endInterview", {
    interviewId: interview._id,
  });

  const result = response?.data?.data;

  setInterviewID(interview._id);
  setQuestions(recoveredQuestions);
  setEvaluation(result?.evaluation || null);
  setIsComplete(true);

  clearActiveInterview();

  console.log("✅ Interview completed during recovery.");

  return true;
}

// -------------------------------------------------------
// RESTORE ACTIVE INTERVIEW
// -------------------------------------------------------

setInterviewID(interview._id);
setQuestions(recoveredQuestions);
setCurrentQuestionIdx(nextQuestionIndex);

// Important:
// Welcome should NOT play again after refresh.
hasWelcomedRef.current = true;

interviewStartedRef.current = true;

saveActiveInterview(interview._id);

console.log("✅ Interview recovered successfully.");
console.log("📌 Questions:", recoveredQuestions);
console.log("📌 Answers:", recoveredAnswers);
console.log(
  "📌 Resuming from question:",
  nextQuestionIndex + 1
);

return true;
    } catch (error) {
      console.error("❌ Interview Recovery Error:", error);

      console.log("STATUS:", error.response?.status);
      console.log("BACKEND RESPONSE:", error.response?.data);

      // If backend says interview doesn't exist anymore,
      // don't keep stale ID forever.
      if (error.response?.status === 404 || error.response?.status === 400) {
        clearActiveInterview();
      }

      setErrorMsg(
        error.response?.data?.message ||
          error.message ||
          "Interview recover nahi ho paya.",
      );

      return false;
    } finally {
      setLoadingDisplayQuestion(false);
      recoveryStartedRef.current = false;
    }
  };

  // =========================================================
  // 1. START INTERVIEW
  // =========================================================

  const handleStartInterview = async () => {
    if (interviewStartedRef.current) {
      return;
    }

    interviewStartedRef.current = true;

    setLoadingDisplayQuestion(true);
    setErrorMsg(null);

    try {
      let response;

      if (questionsSources === "jd") {
        if (!jobTitle?.trim()) {
          throw new Error("Job title is missing.");
        }

        if (!jobDescription?.trim()) {
          throw new Error("Job description is missing.");
        }

        response = await API.post("/interview/startInterview", {
          questionsSources: "jd",
          jobTitle: jobTitle.trim(),
          jobDescription: jobDescription.trim(),
          experienceLevel: experienceLevel || "junior",
          interviewType: "practice",
        });
      } else if (questionsSources === "topics") {
        if (!Array.isArray(topics) || topics.length === 0) {
          throw new Error("At least one interview topic is required.");
        }

        response = await API.post("/interview/startInterview", {
          questionsSources: "topics",
          topics,
          experienceLevel: experienceLevel || "junior",
          interviewType: "practice",
        });
      } else if (questionsSources === "resume") {
        if (!resumeFile) {
          throw new Error("Resume file is missing.");
        }

        const formData = new FormData();

        formData.append("questionsSources", "resume");
        formData.append("experienceLevel", experienceLevel || "junior");
        formData.append("interviewType", "practice");
        formData.append("resume", resumeFile);

        response = await API.post("/interview/startInterview", formData);
      } else {
        throw new Error("Invalid interview question source.");
      }
      console.log("Start Interview Response:", response?.data);

      const interview = response?.data?.data?.interview;
      if (!interview?._id) {
        throw new Error("Interview session was not created.");
      }

      if (
        !Array.isArray(interview.questions) ||
        interview.questions.length === 0
      ) {
        throw new Error("No interview questions were generated.");
      }

      console.log("Interview ID:", interview._id);
      console.log("Questions:", interview.questions);

      // -------------------------------------------------------
      // IMPORTANT:
      // Persist interview ID immediately.
      // -------------------------------------------------------

      saveActiveInterview(interview._id);
      setInterviewID(interview._id);
      setQuestions(interview.questions);
      setCurrentQuestionIdx(0);

      console.log("✅ New interview session started.");
    } catch (error) {
      console.error("❌ Start Interview Error:", error);
      console.log("STATUS:", error.response?.status);
      console.log("BACKEND RESPONSE:", error.response?.data);

      setErrorMsg(
        error.response?.data?.message ||
          error.message ||
          "Interview start nahi ho paya.",
      );

      interviewStartedRef.current = false;
    } finally {
      setLoadingDisplayQuestion(false);
    }
  };

  // =========================================================
  // 2. INITIALIZE
  // =========================================================

  useEffect(() => {
    const initializeInterview = async () => {
      // -------------------------------------------------------
      // FIRST PRIORITY:
      // Recover an already active interview.
      // -------------------------------------------------------
      try {
        const savedInterviewID = sessionStorage.getItem(ACTIVE_INTERVIEW_KEY);

        if (savedInterviewID) {
          console.log("🔍 Existing active interview found:", savedInterviewID);
          const recovered = await recoverInterview(savedInterviewID);

          if (recovered) {
            console.log("✅ Interview recovered successfully.");
            return;
          }
          // IMPORTANT:
          // Do NOT automatically create a new interview here.
          return;
        }
        if (!questionsSources) {
          console.error("Interview configuration missing.");
          navigate("/");
          return;
        }

        await handleStartInterview();
      } catch (error) {
        console.error("❌ Interview initialization error:", error);
        setErrorMsg(error?.message || "Interview initialization failed.");
      }
    };

    initializeInterview();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // =========================================================
  // 3. NETWORK STATUS
  // =========================================================

  useEffect(() => {
    const handleOffline = () => {
      console.warn("📴 Browser went offline.");

      setIsOffline(true);

      setErrorMsg(
        "Internet connection lost. Your interview session is محفوظ ہے. Please reconnect.",
      );
    };

    const handleOnline = async () => {
      console.log("🌐 Browser is back online.");

      setIsOffline(false);

      if (!interviewID) {
        return;
      }

      // Don't interrupt recording/submission/TTS.
      if (isRecording || isSubmitting || isSpeaking) {
        setErrorMsg(null);
        return;
      }

      if (reconnectingRef.current) {
        return;
      }

      reconnectingRef.current = true;

      try {
        console.log("🔄 Checking interview after reconnect...");

        await recoverInterview(interviewID);

        setErrorMsg(null);
      } catch (error) {
        console.error("❌ Reconnect recovery error:", error);
      } finally {
        reconnectingRef.current = false;
      }
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, [interviewID, isRecording, isSubmitting, isSpeaking]);

  // =========================================================
  // 4. QUESTION CHANGE → WELCOME OR TTS
  // =========================================================

  useEffect(() => {
    if (questions.length === 0 || !interviewID || isComplete) {
      return;
    }

    const question = questions[currentQuestionIdx];

    if (!question) {
      return;
    }

    // If this question has no text, don't attempt TTS.
    if (!question.questionText) {
      return;
    }

    if (!hasWelcomedRef.current) {
      hasWelcomedRef.current = true;

      speakWelcomeThenQuestion(question.questionText);
    } else {
      speakQuestion(question.questionText);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestionIdx, questions, interviewID, isComplete]);

  // =========================================================
  // 5. TTS — GENERIC AUDIO PLAY HELPER
  // =========================================================

  const playTTS = async (text, onFinished) => {
    if (!text) {
      return;
    }

    if (isOffline) {
      setErrorMsg("Internet connection available nahi hai. Please reconnect.");
      return;
    }

    try {
      setErrorMsg(null);

      // -------------------------------------------------------
      // CLEAN OLD AUDIO SAFELY
      // -------------------------------------------------------

      if (audioElementRef.current) {
        const oldAudio = audioElementRef.current;

        oldAudio.onended = null;
        oldAudio.onerror = null;
        oldAudio.onabort = null;

        oldAudio.pause();
        oldAudio.removeAttribute("src");
        oldAudio.load();

        audioElementRef.current = null;
      }

      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);

        audioUrlRef.current = null;
      }

      console.log("🔊 TTS Request:", text);

      const response = await API.post("/interview/textToSpeech", {
        text,
      });

      console.log("🔊 TTS Backend Response:", response?.data);

      const audioBase64 =
        response?.data?.data?.audioContent ||
        response?.data?.data?.audioBase64 ||
        response?.data?.data?.audio ||
        response?.data?.audioContent ||
        response?.data?.audioBase64 ||
        response?.data?.audio;

      if (!audioBase64) {
        console.error("❌ Complete TTS response:", response?.data);

        throw new Error("TTS audio data missing from backend response.");
      }

      console.log("✅ Audio received. Base64 length:", audioBase64.length);

      const audioBlob = base64ToBlob(audioBase64, "audio/wav");

      if (!audioBlob || audioBlob.size === 0) {
        throw new Error("TTS audio blob is empty.");
      }

      console.log("✅ Audio Blob:", audioBlob.size, "bytes");

      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio();
      audio.src = audioUrl;
      audio.preload = "auto";
      audioUrlRef.current = audioUrl;
      audioElementRef.current = audio;

      // -------------------------------------------------------
      // AUDIO ENDED
      // -------------------------------------------------------

      audio.onended = () => {
        console.log("🔊 Audio finished.");

        URL.revokeObjectURL(audioUrl);

        if (audioElementRef.current === audio) {
          audioElementRef.current = null;
        }

        if (audioUrlRef.current === audioUrl) {
          audioUrlRef.current = null;
        }

        setIsSpeaking(false);

        onFinished?.();
      };

      // -------------------------------------------------------
      // AUDIO ERROR
      // -------------------------------------------------------

      audio.onerror = (event) => {
        console.error("❌ Audio playback error:", event);

        URL.revokeObjectURL(audioUrl);

        if (audioElementRef.current === audio) {
          audioElementRef.current = null;
        }

        if (audioUrlRef.current === audioUrl) {
          audioUrlRef.current = null;
        }

        setIsSpeaking(false);

        setErrorMsg("Audio playback error.");
      };

      // -------------------------------------------------------
      // PLAY
      // -------------------------------------------------------

      setIsSpeaking(true);
      setIsRecording(false);

      await audio.play();

      console.log("▶️ Audio playing...");
    } catch (error) {
      console.error("❌ Text To Speech Error:", error);

      console.log("STATUS:", error.response?.status);

      console.log("BACKEND RESPONSE:", error.response?.data);

      setIsSpeaking(false);

      setErrorMsg(
        error.response?.data?.message ||
          error.message ||
          "Speech generate nahi ho paya.",
      );
    }
  };

  // =========================================================
  // 6. SPEAK WELCOME + QUESTION
  // =========================================================

  const speakWelcomeThenQuestion = (questionText) => {
    playTTS(WELCOME_TEXT, () => speakQuestion(questionText));
  };

  // =========================================================
  // 7. SPEAK QUESTION
  // =========================================================

  const speakQuestion = (questionText) => {
    if (!questionText) {
      return;
    }

    playTTS(questionText, () => startRecording());
  };

  // =========================================================
  // 8. BASE64 → BLOB
  // =========================================================

  const base64ToBlob = (base64, mimeType = "audio/wav") => {
    if (!base64) {
      throw new Error("Empty audio data received.");
    }

    const cleanBase64 = base64.includes(",") ? base64.split(",")[1] : base64;

    const byteCharacters = window.atob(cleanBase64);

    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
      const slice = byteCharacters.slice(offset, offset + 1024);

      const byteNumbers = new Array(slice.length);

      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      byteArrays.push(new Uint8Array(byteNumbers));
    }

    return new Blob(byteArrays, {
      type: mimeType,
    });
  };

  // =========================================================
  // 9. MICROPHONE STREAM
  // =========================================================

  const getMicrophoneStream = async () => {
    if (mediaStreamRef.current) {
      return mediaStreamRef.current;
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    mediaStreamRef.current = stream;

    return stream;
  };

  // =========================================================
  // 10. START RECORDING
  // =========================================================

  const startRecording = async () => {
    if (
      hasStartedRecordingRef.current ||
      isSubmittingRef.current ||
      isComplete
    ) {
      return;
    }

    if (isOffline) {
      setErrorMsg("Internet connection available nahi hai.");

      return;
    }

    try {
      const stream = await getMicrophoneStream();

      setErrorMsg(null);

      audioChunksRef.current = [];

      const mimeType = getSupportedMimeType();

      const recorder = mimeType
        ? new MediaRecorder(stream, {
            mimeType,
          })
        : new MediaRecorder(stream);

      mediaRecorderRef.current = recorder;

      hasStartedRecordingRef.current = true;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
          if (isUnmountingRef.current) {
    console.log("🧹 Recording stopped because component is unmounting.");
    return;
  }
        handleRecordingStopped(mimeType || "audio/webm");
      };

      recorder.onerror = (event) => {
        console.error("❌ MediaRecorder error:", event);
        hasStartedRecordingRef.current = false;
        setIsRecording(false);
        setErrorMsg("Audio recording mein problem aayi.");
      };

      recorder.start();

      setIsRecording(true);

      console.log("🎙️ Recording started.");

      startSilenceDetection(stream);
    } catch (error) {
      console.error("❌ Recording Start Error:", error);

      if (error?.name === "NotAllowedError") {
        setErrorMsg(
          "Microphone permission denied. Please allow microphone access and retry.",
        );
      } else if (error?.name === "NotFoundError") {
        setErrorMsg(
          "No microphone found. Please connect a microphone and retry.",
        );
      } else {
        setErrorMsg("Microphone access nahi mil paya.");
      }

      setIsRecording(false);
    }
  };

  // =========================================================
  // 11. MIME TYPE
  // =========================================================

  const getSupportedMimeType = () => {
    const types = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"];

    return types.find((type) => MediaRecorder.isTypeSupported(type)) || "";
  };

  // =========================================================
  // 12. SILENCE DETECTION
  // =========================================================

  const startSilenceDetection = (stream) => {
    stopSilenceDetection();

    const AudioContext = window.AudioContext || window.webkitAudioContext;

    if (!AudioContext) {
      console.warn("AudioContext not supported.");

      return;
    }

    const audioContext = new AudioContext();

    const source = audioContext.createMediaStreamSource(stream);

    const analyser = audioContext.createAnalyser();

    analyser.fftSize = 2048;

    analyser.smoothingTimeConstant = 0.8;

    source.connect(analyser);

    audioContextRef.current = audioContext;

    analyserRef.current = analyser;

    const dataArray = new Uint8Array(analyser.fftSize);

    let silenceStartedAt = null;

    let hasDetectedSpeech = false;

    const detectSilence = () => {
      if (
        !mediaRecorderRef.current ||
        mediaRecorderRef.current.state !== "recording"
      ) {
        return;
      }

      analyser.getByteTimeDomainData(dataArray);

      let sum = 0;

      for (let i = 0; i < dataArray.length; i++) {
        const normalized = (dataArray[i] - 128) / 128;

        sum += normalized * normalized;
      }

      const rms = Math.sqrt(sum / dataArray.length);

      const isSilent = rms < SILENCE_THRESHOLD;

      if (!isSilent) {
        hasDetectedSpeech = true;

        silenceStartedAt = null;
      } else if (hasDetectedSpeech) {
        if (silenceStartedAt === null) {
          silenceStartedAt = Date.now();
        }

        const silenceDuration = Date.now() - silenceStartedAt;

        if (silenceDuration >= SILENCE_DURATION) {
          console.log("🔇 8 seconds silence detected after speech.");

          stopRecording();

          return;
        }
      }

      animationFrameRef.current = requestAnimationFrame(detectSilence);
    };

    detectSilence();
  };

  // =========================================================
  // 13. STOP SILENCE DETECTION
  // =========================================================

  const stopSilenceDetection = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);

      animationFrameRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});

      audioContextRef.current = null;
    }

    analyserRef.current = null;
  };

  // =========================================================
  // 14. STOP RECORDING
  // =========================================================

  const stopRecording = () => {
    if (!mediaRecorderRef.current) {
      return;
    }

    if (mediaRecorderRef.current.state === "recording") {
      stopSilenceDetection();

      setIsRecording(false);

      mediaRecorderRef.current.stop();

      console.log("🛑 Recording stopped.");
    }
  };

  // =========================================================
  // 15. RECORDING COMPLETED
  // =========================================================

  const handleRecordingStopped = (mimeType) => {
    hasStartedRecordingRef.current = false;

    const audioBlob = new Blob(audioChunksRef.current, {
      type: mimeType,
    });

    audioChunksRef.current = [];

    console.log("🎤 FINAL AUDIO:", {
      blobSize: audioBlob.size,
      blobType: audioBlob.type,
      recorderMimeType: mimeType,
    });

    if (audioBlob.size === 0) {
      setErrorMsg("Koi audio record nahi hua. Please retry.");

      return;
    }

    console.log("🎤 Recorded audio:", audioBlob.size, "bytes");

    submitAnswer(audioBlob);
  };

  // =========================================================
  // 16. SUBMIT ANSWER
  // =========================================================

  const submitAnswer = async (audioBlob) => {
    if (isSubmittingRef.current) {
      return;
    }

    if (!interviewID) {
      setErrorMsg("Interview session missing. Please recover the interview.");

      return;
    }

    if (isOffline) {
      setErrorMsg(
        "Internet connection lost. Answer submit nahi ho sakta. Please reconnect and retry.",
      );

      return;
    }

    isSubmittingRef.current = true;

    setIsSubmitting(true);

    setErrorMsg(null);

    try {
      const formData = new FormData();

      formData.append("interviewId", interviewID);

      formData.append("questionIndex", String(currentQuestionIdx));

      const extension = audioBlob.type.includes("mp4")
        ? "mp4"
        : audioBlob.type.includes("webm")
          ? "webm"
          : "wav";

      formData.append(
        "audio",
        audioBlob,
        `answer-${currentQuestionIdx + 1}.${extension}`,
      );

      console.log("📤 Submitting answer:", {
        interviewId: interviewID,
        questionIndex: currentQuestionIdx,
        audioSize: audioBlob.size,
      });

      const response = await API.post("/interview/submitAnswer", formData);

      console.log("✅ Answer submitted:", response.data);

      const isLastQuestion = currentQuestionIdx + 1 >= questions.length;

      if (isLastQuestion) {
        await finishInterview();
      } else {
        setCurrentQuestionIdx((prev) => prev + 1);
      }
    } catch (error) {
      console.error("❌ Submit Answer Error:", error);

      console.log("STATUS:", error.response?.status);

      console.log("BACKEND RESPONSE:", error.response?.data);

      setErrorMsg(
        error.response?.data?.message ||
          "Answer submit nahi ho paya. Please retry.",
      );
    } finally {
      isSubmittingRef.current = false;

      setIsSubmitting(false);
    }
  };

  // =========================================================
  // 17. END INTERVIEW
  // =========================================================

  const finishInterview = async () => {
    if (!interviewID) {
      return;
    }

    if (isOffline) {
      setErrorMsg(
        "Internet connection lost. Interview complete nahi ho sakta. Please reconnect.",
      );

      return;
    }

    try {
      setErrorMsg(null);

      console.log("🏁 Ending interview:", interviewID);

      const response = await API.post("/interview/endInterview", {
        interviewId: interviewID,
      });

      console.log("📊 Interview Evaluation:", response.data);

      const result = response?.data?.data;

      setEvaluation(result?.evaluation || null);

      setIsComplete(true);

      // Interview is successfully completed.
      clearActiveInterview();
    } catch (error) {
      console.error("❌ End Interview Error:", error);

      console.log("STATUS:", error.response?.status);

      console.log("BACKEND RESPONSE:", error.response?.data);

      setErrorMsg(
        error.response?.data?.message ||
          "Interview evaluation generate nahi ho payi.",
      );

      // IMPORTANT:
      // Do NOT clear active interview here.
      // If evaluation API fails, refresh can recover
      // the interview again.
    }
  };

  // =========================================================
  // 18. MANUAL STOP
  // =========================================================

  const stopListeningManually = () => {
    if (isRecording && mediaRecorderRef.current) {
      stopRecording();
    }
  };

  // =========================================================
  // 19. CLEANUP
  // =========================================================

  useEffect(() => {
    return () => {
      stopSilenceDetection();

      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state === "recording"
      ) {
        mediaRecorderRef.current.stop();
      }

      if (audioElementRef.current) {
        audioElementRef.current.pause();

        audioElementRef.current.onended = null;

        audioElementRef.current.onerror = null;

        audioElementRef.current.onabort = null;

        audioElementRef.current = null;
      }

      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);

        audioUrlRef.current = null;
      }

      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());

        mediaStreamRef.current = null;
      }

      // IMPORTANT:
      // We intentionally DO NOT remove
      // ACTIVE_INTERVIEW_KEY here.
      //
      // React unmount also happens during browser refresh.
      // Keeping the ID allows recovery after refresh.
    };
  }, []);

  // =========================================================
  // 20. STATUS
  // =========================================================

  const evaluationStatus = isSpeaking
    ? "speaking"
    : isRecording
      ? "listening"
      : isSubmitting
        ? "processing"
        : "idle";

  // =========================================================
  // TRANSCRIPTION PANEL
  // =========================================================

  const transcriptionItems = questions[currentQuestionIdx]
    ? [questions[currentQuestionIdx]]
    : [];

  // =========================================================
  // COMPLETE SCREEN
  // =========================================================

  if (isComplete) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#030712] via-[#070f2b] to-[#0f172a] px-6 text-[#eaecf0]">
        <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-[#0d1538]/80 p-8 text-center shadow-2xl backdrop-blur-xl">
          <h2 className="text-3xl font-bold text-white">Interview Complete!</h2>

          <p className="mt-2 text-[#9aa1b4]">Your AI evaluation is ready.</p>

          {evaluation && (
            <div className="mt-8 text-left">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
                <p className="text-sm text-[#9aa1b4]">Overall Score</p>

                <p className="mt-2 text-5xl font-bold text-white">
                  {evaluation.overallScore}

                  <span className="text-2xl text-[#9aa1b4]">/10</span>
                </p>
              </div>

              {evaluation.feedbackSummary && (
                <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-5">
                  <h3 className="font-semibold text-white">Feedback</h3>

                  <p className="mt-2 text-sm leading-6 text-[#b8becd]">
                    {evaluation.feedbackSummary}
                  </p>
                </div>
              )}

              {Array.isArray(evaluation.skillsAssessment) &&
                evaluation.skillsAssessment.length > 0 && (
                  <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-5">
                    <h3 className="font-semibold text-white">
                      Skills Assessment
                    </h3>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {evaluation.skillsAssessment.map((skill, index) => (
                        <span
                          key={index}
                          className="rounded-full border border-[#6366f1]/30 bg-[#6366f1]/10 px-3 py-1.5 text-xs text-[#d7d9e3]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // =========================================================
  // MAIN UI
  // =========================================================

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gradient-to-br from-[#030712] via-[#070f2b] to-[#0f172a] text-[#eaecf0]">
      <InterviewTopBar
        jobTitle={
          jobTitle ||
          (questionsSources === "topics"
            ? "Topic Based Interview"
            : questionsSources === "resume"
              ? "Resume Based Interview"
              : "AI Interview")
        }
        currentIndex={currentQuestionIdx}
        totalQuestions={questions.length}
      />

      {/* =====================================================
          OFFLINE BANNER
      ===================================================== */}

      {isOffline && (
        <div className="mx-6 mt-4 rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-4 py-2 text-sm text-yellow-300">
          Internet connection lost. Your active interview session is محفوظ है.
          Reconnect to continue.
        </div>
      )}

      {/* =====================================================
          ERROR
      ===================================================== */}

      {errorMsg && (
        <div className="mx-6 mt-4 flex items-center justify-between rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">
          <span>{errorMsg}</span>

          {!isSpeaking &&
            !isRecording &&
            !isSubmitting &&
            questions.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  const question = questions[currentQuestionIdx];

                  if (question?.questionText) {
                    speakQuestion(question.questionText);
                  }
                }}
                className="ml-3 rounded-md bg-red-500/20 px-3 py-1 font-semibold hover:bg-red-500/30"
              >
                Retry
              </button>
            )}
        </div>
      )}

      {/* =====================================================
          LOADING / RECOVERY
      ===================================================== */}

      {loadingDisplayQuestion && questions.length === 0 && (
        <div className="mx-6 mt-4 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-4 py-3 text-sm text-indigo-300">
          Restoring your interview session...
        </div>
      )}

      <main className="flex min-h-0 flex-1 flex-col overflow-hidden px-6 py-8">
        {/* ===================================================
            INTERVIEWER + CAMERA
        =================================================== */}

        <div className="mx-auto grid w-[900px] max-w-[1100px] grid-cols-2 gap-8">
          <div className="h-[320px]">
            <InterviewerPanel isSpeaking={isSpeaking} interviewerName="Mira" />
          </div>

          <div className="h-[320px]">
            <CameraSection isRecording={isRecording} />
          </div>
        </div>

        {/* ===================================================
            TRANSCRIPTION
        =================================================== */}

        <div className="mx-auto mt-4 w-full max-w-[1400px] min-h-0 flex-1">
          <EvaluationPanel
            status={evaluationStatus}
            feedbackItems={transcriptionItems}
          />
        </div>
      </main>
    </div>
  );
}
