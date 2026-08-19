import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import QuestionDisplay from "./QuestionDisplay";
import InterviewTopBar from "./InterviewTopBar";
import CameraSection from "./CameraSection";
import EvaluationPanel from "./EvaluationPanel";
import InterviewControlBar from "./InterviewControlBar";

import API from "../../services/api";

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

  const [loadingDisplayQuestion, setLoadingDisplayQuestion] =
    useState(false);

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isComplete, setIsComplete] = useState(false);

  const [errorMsg, setErrorMsg] = useState(null);

  const [evaluation, setEvaluation] = useState(null);

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

  // =========================================================
  // CONSTANTS
  // =========================================================

  const SILENCE_DURATION = 8000;

  // RMS threshold.
  // Lower = more sensitive
  // Higher = less sensitive
  const SILENCE_THRESHOLD = 0.015;

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

      // =====================================================
      // JD
      // =====================================================

      if (questionsSources === "jd") {
        if (!jobTitle?.trim()) {
          throw new Error("Job title is missing.");
        }

        if (!jobDescription?.trim()) {
          throw new Error("Job description is missing.");
        }

        response = await API.post(
          "/interview/startInterview",
          {
            questionsSources: "jd",
            jobTitle: jobTitle.trim(),
            jobDescription: jobDescription.trim(),
            experienceLevel: experienceLevel || "junior",
            interviewType: "practice",
          }
        );
      }

      // =====================================================
      // TOPICS
      // =====================================================

      else if (questionsSources === "topics") {
        if (!Array.isArray(topics) || topics.length === 0) {
          throw new Error(
            "At least one interview topic is required."
          );
        }

        response = await API.post(
          "/interview/startInterview",
          {
            questionsSources: "topics",
            topics,
            experienceLevel: experienceLevel || "junior",
            interviewType: "practice",
          }
        );
      }

      // =====================================================
      // RESUME
      // =====================================================

      else if (questionsSources === "resume") {
        if (!resumeFile) {
          throw new Error("Resume file is missing.");
        }

        const formData = new FormData();

        formData.append(
          "questionsSources",
          "resume"
        );

        formData.append(
          "experienceLevel",
          experienceLevel || "junior"
        );

        formData.append(
          "interviewType",
          "practice"
        );

        formData.append(
          "resume",
          resumeFile
        );

        response = await API.post(
          "/interview/startInterview",
          formData
        );
      }

      // =====================================================
      // INVALID SOURCE
      // =====================================================

      else {
        throw new Error(
          "Invalid interview question source."
        );
      }

      // =====================================================
      // RESPONSE
      // =====================================================

      console.log(
        "Start Interview Response:",
        response?.data
      );

      const interview =
        response?.data?.data?.interview;

      if (!interview?._id) {
        throw new Error(
          "Interview session was not created."
        );
      }

      if (
        !Array.isArray(interview.questions) ||
        interview.questions.length === 0
      ) {
        throw new Error(
          "No interview questions were generated."
        );
      }

      console.log(
        "Interview ID:",
        interview._id
      );

      console.log(
        "Questions:",
        interview.questions
      );

      setInterviewID(interview._id);

      setQuestions(interview.questions);

      setCurrentQuestionIdx(0);

    } catch (error) {
      console.error(
        "❌ Start Interview Error:",
        error
      );

      console.log(
        "STATUS:",
        error.response?.status
      );

      console.log(
        "BACKEND RESPONSE:",
        error.response?.data
      );

      setErrorMsg(
        error.response?.data?.message ||
          error.message ||
          "Interview start nahi ho paya."
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
    if (!questionsSources) {
      console.error(
        "Interview configuration missing."
      );

      navigate("/");

      return;
    }

    handleStartInterview();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // =========================================================
  // 3. QUESTION CHANGE → TTS
  // =========================================================

  useEffect(() => {
    if (
      questions.length === 0 ||
      !interviewID ||
      isComplete
    ) {
      return;
    }

    const question =
      questions[currentQuestionIdx];

    if (!question) {
      return;
    }

    speakQuestion(question);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentQuestionIdx,
    questions,
    interviewID,
    isComplete,
  ]);

  // =========================================================
  // 4. TEXT TO SPEECH
  // =========================================================

  const speakQuestion = async (questionText) => {
    if (!questionText) {
      return;
    }

    try {
      setErrorMsg(null);

      setIsSpeaking(true);
      setIsRecording(false);

      // -----------------------------------------------------
      // Stop previous audio
      // -----------------------------------------------------

      if (audioElementRef.current) {
        audioElementRef.current.pause();
        audioElementRef.current.currentTime = 0;
        audioElementRef.current = null;
      }

      if (audioUrlRef.current) {
        URL.revokeObjectURL(
          audioUrlRef.current
        );

        audioUrlRef.current = null;
      }

      console.log(
        "🔊 TTS Request:",
        questionText
      );

      // -----------------------------------------------------
      // Backend TTS
      // -----------------------------------------------------

      const response = await API.post(
        "/interview/textToSpeech",
        {
          text: questionText,
        }
      );

      console.log(
        "🔊 TTS Backend Response:",
        response?.data
      );

      // -----------------------------------------------------
      // Extract Azure audio
      // -----------------------------------------------------

      const audioBase64 =
        response?.data?.data?.audioContent ||
        response?.data?.data?.audioBase64 ||
        response?.data?.data?.audio ||
        response?.data?.audioContent ||
        response?.data?.audioBase64 ||
        response?.data?.audio;

      if (!audioBase64) {
        console.error(
          "❌ Complete TTS response:",
          response?.data
        );

        throw new Error(
          "TTS audio data missing from backend response."
        );
      }

      console.log(
        "✅ Audio received. Base64 length:",
        audioBase64.length
      );

      // -----------------------------------------------------
      // Azure usually returns WAV when configured with
      // Riff/PCM output.
      // -----------------------------------------------------

      const audioBlob = base64ToBlob(
        audioBase64,
        "audio/wav"
      );

      if (!audioBlob || audioBlob.size === 0) {
        throw new Error(
          "TTS audio blob is empty."
        );
      }

      console.log(
        "✅ Audio Blob:",
        audioBlob.size,
        "bytes"
      );

      // -----------------------------------------------------
      // Create Audio
      // -----------------------------------------------------

      const audioUrl =
        URL.createObjectURL(audioBlob);

      audioUrlRef.current = audioUrl;

      const audio = new Audio(audioUrl);

      audioElementRef.current = audio;

      // -----------------------------------------------------
      // Audio finished
      // -----------------------------------------------------

      audio.onended = () => {
        console.log(
          "🔊 Question audio finished."
        );

        if (audioUrlRef.current) {
          URL.revokeObjectURL(
            audioUrlRef.current
          );

          audioUrlRef.current = null;
        }

        setIsSpeaking(false);

        // ---------------------------------------------------
        // TTS finished → candidate recording
        // ---------------------------------------------------

        startRecording();
      };
     
      // -----------------------------------------------------
      // Audio error
      // -----------------------------------------------------

      audio.onerror = (event) => {
        console.error(
          "❌ Audio playback error:",
          event
        );

        if (audioUrlRef.current) {
          URL.revokeObjectURL(
            audioUrlRef.current
          );

          audioUrlRef.current = null;
        }

        setIsSpeaking(false);

        setErrorMsg(
          "Question audio play nahi ho paya."
        );
      };

      // -----------------------------------------------------
      // Play
      // -----------------------------------------------------

      await audio.play();

      console.log(
        "▶️ TTS audio playing..."
      );

    } catch (error) {
      console.error(
        "❌ Text To Speech Error:",
        error
      );

      console.log(
        "STATUS:",
        error.response?.status
      );

      console.log(
        "BACKEND RESPONSE:",
        error.response?.data
      );

      setIsSpeaking(false);

      setErrorMsg(
        error.response?.data?.message ||
          error.message ||
          "Question speak nahi ho paya."
      );
    }
  };

  // =========================================================
  // 5. BASE64 → BLOB
  // =========================================================

  const base64ToBlob = (
    base64,
    mimeType = "audio/wav"
  ) => {
    if (!base64) {
      throw new Error(
        "Empty audio data received."
      );
    }

    // Handles:
    //
    // data:audio/wav;base64,XXXX
    //
    // and:
    //
    // XXXX

    const cleanBase64 =
      base64.includes(",")
        ? base64.split(",")[1]
        : base64;

    const byteCharacters =
      window.atob(cleanBase64);

    const byteArrays = [];

    for (
      let offset = 0;
      offset < byteCharacters.length;
      offset += 1024
    ) {
      const slice =
        byteCharacters.slice(
          offset,
          offset + 1024
        );

      const byteNumbers =
        new Array(slice.length);

      for (
        let i = 0;
        i < slice.length;
        i++
      ) {
        byteNumbers[i] =
          slice.charCodeAt(i);
      }

      byteArrays.push(
        new Uint8Array(
          byteNumbers
        )
      );
    }

    return new Blob(
      byteArrays,
      {
        type: mimeType,
      }
    );
  };

  // =========================================================
  // 6. MICROPHONE STREAM
  // =========================================================

  const getMicrophoneStream =
    async () => {
      if (mediaStreamRef.current) {
        return mediaStreamRef.current;
      }

      const stream =
        await navigator.mediaDevices.getUserMedia(
          {
            audio: true,
          }
        );

      mediaStreamRef.current =
        stream;

      return stream;
    };

  // =========================================================
  // 7. START RECORDING
  // =========================================================

  const startRecording =
    async () => {
      if (
        hasStartedRecordingRef.current ||
        isSubmittingRef.current ||
        isComplete
      ) {
        return;
      }

      try {
        const stream =
          await getMicrophoneStream();

        setErrorMsg(null);

        audioChunksRef.current = [];

        const mimeType =
          getSupportedMimeType();

        let recorder;

        if (mimeType) {
          recorder =
            new MediaRecorder(
              stream,
              {
                mimeType,
              }
            );
        } else {
          recorder =
            new MediaRecorder(stream);
        }

        mediaRecorderRef.current =
          recorder;

        hasStartedRecordingRef.current =
          true;

        recorder.ondataavailable =
          (event) => {
            if (
              event.data &&
              event.data.size > 0
            ) {
              audioChunksRef.current.push(
                event.data
              );
            }
          };

        recorder.onstop = () => {
          handleRecordingStopped(
            mimeType || "audio/webm"
          );
        };

        recorder.onerror =
          (event) => {
            console.error(
              "❌ MediaRecorder error:",
              event
            );

            hasStartedRecordingRef.current =
              false;

            setIsRecording(false);

            setErrorMsg(
              "Audio recording mein problem aayi."
            );
          };

        recorder.start();

        setIsRecording(true);

        console.log(
          "🎙️ Recording started."
        );

        startSilenceDetection(
          stream
        );

      } catch (error) {
        console.error(
          "❌ Recording Start Error:",
          error
        );

        setErrorMsg(
          "Microphone access nahi mil paya."
        );

        setIsRecording(false);
      }
    };

  // =========================================================
  // 8. MIME TYPE
  // =========================================================

  const getSupportedMimeType =
    () => {
      const types = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/mp4",
      ];

      return (
        types.find((type) =>
          MediaRecorder.isTypeSupported(
            type
          )
        ) || ""
      );
    };

  // =========================================================
  // 9. SILENCE DETECTION
  // =========================================================

  const startSilenceDetection =
    (stream) => {
      stopSilenceDetection();

      const AudioContext =
        window.AudioContext ||
        window.webkitAudioContext;

      if (!AudioContext) {
        console.warn(
          "AudioContext not supported."
        );

        return;
      }

      const audioContext =
        new AudioContext();

      const source =
        audioContext.createMediaStreamSource(
          stream
        );

      const analyser =
        audioContext.createAnalyser();

      analyser.fftSize = 2048;

      analyser.smoothingTimeConstant =
        0.8;

      source.connect(analyser);

      audioContextRef.current =
        audioContext;

      analyserRef.current =
        analyser;

      const dataArray =
        new Uint8Array(
          analyser.fftSize
        );

    let silenceStartedAt = null;
let hasDetectedSpeech = false;

      const detectSilence =
        () => {
          if (
            !mediaRecorderRef.current ||
            mediaRecorderRef.current
              .state !== "recording"
          ) {
            return;
          }

          analyser.getByteTimeDomainData(
            dataArray
          );

          let sum = 0;

          for ( let i = 0; i < dataArray.length;i++) {
            const normalized = (dataArray[i] - 128) / 128;
            sum +=normalized* normalized;
          }

          const rms =
            Math.sqrt(
              sum /
                dataArray.length
            );
  const isSilent = rms < SILENCE_THRESHOLD;
     if (!isSilent) {
  // Candidate ne actual speech start ki
  hasDetectedSpeech = true;

  // Speech aa rahi hai, silence timer reset
  silenceStartedAt = null;

} else if (hasDetectedSpeech) {
  // Speech pehle aa chuki hai,
  // ab silence count karo

  if (silenceStartedAt === null) {
    silenceStartedAt = Date.now();
  }

  const silenceDuration =
    Date.now() - silenceStartedAt;

  if (silenceDuration >= SILENCE_DURATION) {
    console.log(
      "🔇 8 seconds silence detected after speech."
    );

    stopRecording();
    return;
  }
          }// else {
          //   silenceStartedAt = null;
          // }

          animationFrameRef.current =
            requestAnimationFrame(
              detectSilence
            );
        };

      detectSilence();
    };

  // =========================================================
  // 10. STOP SILENCE DETECTION
  // =========================================================

  const stopSilenceDetection =
    () => {
      if (
        animationFrameRef.current
      ) {
        cancelAnimationFrame(
          animationFrameRef.current
        );

        animationFrameRef.current =
          null;
      }

      if (
        audioContextRef.current
      ) {
        audioContextRef.current
          .close()
          .catch(() => {});

        audioContextRef.current =
          null;
      }

      analyserRef.current =
        null;
    };

  // =========================================================
  // 11. STOP RECORDING
  // =========================================================

  const stopRecording =
    () => {
      if (
        !mediaRecorderRef.current
      ) {
        return;
      }

      if (
        mediaRecorderRef.current
          .state === "recording"
      ) {
        stopSilenceDetection();

        setIsRecording(false);

        mediaRecorderRef.current.stop();

        console.log(
          "🛑 Recording stopped."
        );
      }
    };

  // =========================================================
  // 12. RECORDING COMPLETED
  // =========================================================

  const handleRecordingStopped =
    (mimeType) => {
      hasStartedRecordingRef.current =
        false;

      const audioBlob =
        new Blob(
          audioChunksRef.current,
          {
            type: mimeType,
          }
        );

      audioChunksRef.current = [];
     console.log("🎤 FINAL AUDIO:", {
    blobSize: audioBlob.size,
    blobType: audioBlob.type,
    recorderMimeType: mimeType,
     });
      if (audioBlob.size === 0) {
        setErrorMsg(
          "Koi audio record nahi hua. Please retry."
        );

        return;
      }

      console.log(
        "🎤 Recorded audio:",
        audioBlob.size,
        "bytes"
      );

      submitAnswer(audioBlob);
    };

  // =========================================================
  // 13. SUBMIT ANSWER
  // =========================================================

  const submitAnswer =
    async (audioBlob) => {
      if (
        isSubmittingRef.current
      ) {
        return;
      }

      isSubmittingRef.current =
        true;

      setIsSubmitting(true);

      setErrorMsg(null);

      try {
        const formData =
          new FormData();

        formData.append(
          "interviewId",
          interviewID
        );

        formData.append(
          "questionIndex",
          String(
            currentQuestionIdx
          )
        );

        const extension = audioBlob.type.includes("mp4")
  ? "mp4"
  : audioBlob.type.includes("webm")
    ? "webm"
    : "wav";

formData.append(
  "audio",
  audioBlob,
  `answer-${currentQuestionIdx + 1}.${extension}`
);
        console.log(
          "📤 Submitting answer:",
          {
            interviewId: interviewID,
            questionIndex:
              currentQuestionIdx,
            audioSize:
              audioBlob.size,
          }
        );

        const response =
          await API.post(
            "/interview/submitAnswer",
            formData
          );

        console.log(
          "✅ Answer submitted:",
          response.data
        );

        const isLastQuestion =
          currentQuestionIdx + 1 >=
          questions.length;

        if (isLastQuestion) {
          await finishInterview();
        } else {
          setCurrentQuestionIdx(
            (prev) => prev + 1
          );
        }

      } catch (error) {
        console.error(
          "❌ Submit Answer Error:",
          error
        );

        console.log(
          "STATUS:",
          error.response?.status
        );

        console.log(
          "BACKEND RESPONSE:",
          error.response?.data
        );

        setErrorMsg(
          error.response?.data?.message ||
            "Answer submit nahi ho paya. Please retry."
        );

      } finally {
        isSubmittingRef.current =
          false;

        setIsSubmitting(false);
      }
    };

  // =========================================================
  // 14. END INTERVIEW
  // =========================================================

  const finishInterview =
    async () => {
      try {
        setErrorMsg(null);

        console.log(
          "🏁 Ending interview:",
          interviewID
        );

        const response =
          await API.post(
            "/interview/endInterview",
            {
              interviewId:
                interviewID,
            }
          );

        console.log(
          "📊 Interview Evaluation:",
          response.data
        );

        const result =
          response?.data?.data;

        setEvaluation(
          result?.evaluation || null
        );

        setIsComplete(true);

      } catch (error) {
        console.error(
          "❌ End Interview Error:",
          error
        );

        console.log(
          "STATUS:",
          error.response?.status
        );

        console.log(
          "BACKEND RESPONSE:",
          error.response?.data
        );

        setErrorMsg(
          error.response?.data?.message ||
            "Interview evaluation generate nahi ho payi."
        );
      }
    };

  // =========================================================
  // 15. MANUAL STOP
  // =========================================================

  const stopListeningManually =
    () => {
      if (
        isRecording &&
        mediaRecorderRef.current
      ) {
        stopRecording();
      }
    };

  // =========================================================
  // 16. CLEANUP
  // =========================================================

  useEffect(() => {
    return () => {
      stopSilenceDetection();

      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current
          .state === "recording"
      ) {
        mediaRecorderRef.current.stop();
      }

      if (
        audioElementRef.current
      ) {
        audioElementRef.current.pause();

        audioElementRef.current =
          null;
      }

      if (audioUrlRef.current) {
        URL.revokeObjectURL(
          audioUrlRef.current
        );

        audioUrlRef.current = null;
      }

      if (
        mediaStreamRef.current
      ) {
        mediaStreamRef.current
          .getTracks()
          .forEach(
            (track) =>
              track.stop()
          );

        mediaStreamRef.current =
          null;
      }
    };

  }, []);

  // =========================================================
  // STATUS
  // =========================================================

  const evaluationStatus =
    isSpeaking
      ? "speaking"
      : isRecording
      ? "listening"
      : isSubmitting
      ? "processing"
      : "idle";

  // =========================================================
  // COMPLETE SCREEN
  // =========================================================

  if (isComplete) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#030712] via-[#070f2b] to-[#0f172a] px-6 text-[#eaecf0]">

        <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-[#0d1538]/80 p-8 text-center shadow-2xl backdrop-blur-xl">

          <h2 className="text-3xl font-bold text-white">
            Interview Complete!
          </h2>

          <p className="mt-2 text-[#9aa1b4]">
            Your AI evaluation is ready.
          </p>

          {evaluation && (
            <div className="mt-8 text-left">

              {/* SCORE */}

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">

                <p className="text-sm text-[#9aa1b4]">
                  Overall Score
                </p>

                <p className="mt-2 text-5xl font-bold text-white">
                  {evaluation.overallScore}

                  <span className="text-2xl text-[#9aa1b4]">
                    /10
                  </span>
                </p>

              </div>

              {/* FEEDBACK */}

              {evaluation.feedbackSummary && (
                <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-5">

                  <h3 className="font-semibold text-white">
                    Feedback
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[#b8becd]">
                    {evaluation.feedbackSummary}
                  </p>

                </div>
              )}

              {/* SKILLS */}

              {Array.isArray(
                evaluation.skillsAssessment
              ) &&
                evaluation.skillsAssessment
                  .length > 0 && (

                  <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-5">

                    <h3 className="font-semibold text-white">
                      Skills Assessment
                    </h3>

                    <div className="mt-3 flex flex-wrap gap-2">

                      {evaluation.skillsAssessment.map(
                        (
                          skill,
                          index
                        ) => (
                          <span
                            key={index}
                            className="rounded-full border border-[#6366f1]/30 bg-[#6366f1]/10 px-3 py-1.5 text-xs text-[#d7d9e3]"
                          >
                            {skill}
                          </span>
                        )
                      )}

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

      {/* =====================================================
          TOP BAR
      ===================================================== */}

      <InterviewTopBar
        jobTitle={
          jobTitle ||
          (
            questionsSources ===
            "topics"
              ? "Topic Based Interview"
              : questionsSources ===
                "resume"
              ? "Resume Based Interview"
              : "AI Interview"
          )
        }
        currentIndex={
          currentQuestionIdx
        }
        totalQuestions={
          questions.length
        }
      />

      {/* =====================================================
          ERROR
      ===================================================== */}

      {errorMsg && (
        <div className="mx-6 mt-4 flex items-center justify-between rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">

          <span>
            {errorMsg}
          </span>

          {!isSpeaking &&
            !isRecording &&
            !isSubmitting &&
            questions.length >
              0 && (

              <button
                type="button"
                onClick={() =>
                  speakQuestion(
                    questions[
                      currentQuestionIdx
                    ]
                  )
                }
                className="ml-3 rounded-md bg-red-500/20 px-3 py-1 font-semibold hover:bg-red-500/30"
              >
                Retry
              </button>
            )}

        </div>
      )}

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="flex flex-1 gap-6 overflow-hidden p-6">

        {/* ===================================================
            QUESTION
        =================================================== */}

        <div className="w-[55%]">

          <QuestionDisplay
            questionText={
              questions[
                currentQuestionIdx
              ]
            }
            index={
              currentQuestionIdx
            }
            totalQuestions={
              questions.length
            }
            loading={
              loadingDisplayQuestion
            }
          />

        </div>

        {/* ===================================================
            RIGHT SIDE
        =================================================== */}

        <div className="flex w-[45%] flex-col gap-6">

          <div className="flex-1">

            <CameraSection
              isRecording={
                isRecording
              }
            />

          </div>

          <div className="flex-1">

            <EvaluationPanel
              status={
                evaluationStatus
              }
              feedbackItems={[]}
            />

          </div>

        </div>

      </main>

      {/* =====================================================
          CONTROLS
      ===================================================== */}

      <InterviewControlBar
        onNext={
          stopListeningManually
        }
        isLastQuestion={
          currentQuestionIdx ===
          questions.length - 1
        }
        canProceed={
          isRecording &&
          !isSubmitting
        }
      />

    </div>
  );
}