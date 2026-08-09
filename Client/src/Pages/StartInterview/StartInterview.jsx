import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import QuestionDisplay from "./QuestionDisplay";
import InterviewTopBar from "./InterviewTopBar";
import CameraSection from "./CameraSection";
import EvaluationPanel from "./EvaluationPanel";
import InterviewControlBar from "./InterviewControlBar";
import API from "../../services/api";

export default function StartInterview() {
  const location = useLocation();
  const { jobTitle, jobDescription } = location.state || {};

  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [isRecording, setIsRecording] = useState(false); // ab 'recognition listening' ka indicator hai
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const [interviewID, setInterviewID] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loadingDisplayQuestion, setLoadingDisplayQuestion] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // refs — UI re-render inke liye zaroori nahi
  const recognitionRef = useRef(null);
  const transcriptRef = useRef("");
  const utteranceRef = useRef(null); // Chrome utterance ko beech me drop na kare, isliye persistent reference

  const handleStartInterview = async () => {
    setLoadingDisplayQuestion(true);
    try {
      const response = await API.post("interview/startInterview", {
        jobTitle: jobTitle,
        jobDescription: jobDescription,
        experienceLevel: "mid",
        interviewType: "practice",
      });
      const interviewData = response.data.data.interview;

      setQuestions(interviewData.questions);
      setInterviewID(interviewData._id);
    } catch (error) {
      console.error(error);
      setErrorMsg("Interview start nahi ho paya. Please retry.");
    } finally {
      setLoadingDisplayQuestion(false);
    }
  };

  
  useEffect(() => {
    if (!jobTitle || !jobDescription) {
      console.error("Job title/description missing — redirecting to config");
      // TODO: apna actual config-route yahan daalo
      // navigate('/');
      return;
    }
    handleStartInterview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Naya question aate hi, TTS se sunao — startRecording() nahi, ab speakQuestion()
  useEffect(() => {
    if (questions.length > 0 && !isComplete) {
      speakQuestion(questions[currentQuestionIdx]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestionIdx, questions]);

  // ---- 1. Question ko awaaz se sunana ----
  const speakQuestion = (questionText) => {
    console.log("Question render/speak triggered at:", Date.now());

    const utterance = new SpeechSynthesisUtterance(questionText);
    utterance.onend = () => {
      console.log("TTS actually finished at:", Date.now());
      startListening(); // bolna khatam, ab sunna shuru
    };
    utterance.onerror = () => {
      console.log("TTS errored at:", Date.now());
      startListening(); // TTS fail ho tab bhi flow na roke
    };

    utteranceRef.current = utterance; // persistent reference — Chrome ke mid-speech-drop bug ka fix
    window.speechSynthesis.cancel(); // pehle se koi speech queue me na ho
    window.speechSynthesis.speak(utterance);
  };

  // ---- 2. Candidate ko sunna, text me convert karna, silence par khud stop ----
  const startListening = () => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      setErrorMsg("Aapka browser voice recognition support nahi karta. Chrome try karein.");
      return;
    }

    setErrorMsg(null);
    transcriptRef.current = "";

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          transcriptRef.current += event.results[i][0].transcript + " ";
        }
      }
    };

    // Candidate chup ho gaya — recognition khud detect karta hai, stop() call karo
    recognition.onspeechend = () => {
      recognition.stop(); // isse 'onend' trigger hoga, jahan submit hota hai
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      if (event.error === "no-speech") {
        recognition.stop(); // koi awaaz nahi aayi — isko bhi 'stop' hi treat karo
      } else {
        setErrorMsg("Voice recognition me dikkat aayi. Retry karein.");
      }
    };

    // Recognition rukte hi (silence se ya manually) — yehi submit ka trigger point hai
    recognition.onend = () => {
      setIsRecording(false);
      const finalAnswer = transcriptRef.current.trim();
      if (finalAnswer) {
        submitAnswer(finalAnswer);
      }
      // agar khaali hai, kuch bhi nahi bola gaya — abhi "Next" button se manual retry ho sakta hai
    };

    // Temporary diagnostic — confirm mic actually goes live before any error fires
    recognition.onstart = () => {
      console.log("Recognition actually started — mic is live now");
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  };

  // ---- 3. Text answer backend ko submit ----
  const submitAnswer = async (answerText) => {
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      await API.post("interview/submitAnswer", {
        interviewId: interviewID,
        answerText: answerText,
      });

      const isLastQuestion = currentQuestionIdx + 1 >= questions.length;
      if (isLastQuestion) {
        setIsComplete(true);
      } else {
        setCurrentQuestionIdx((prev) => prev + 1); // sirf success ke baad
      }
    } catch (err) {
      console.error("Submit failed:", err);
      setErrorMsg("Answer submit nahi ho paya. Please retry.");
      // currentQuestionIdx yahan nahi badha — retry pe wahi question rahega
    } finally {
      setIsSubmitting(false);
    }
  };

  // Manual override — candidate khud bolna band karke turant submit karna chahe
  const stopListeningManually = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop(); // isse bhi 'onend' -> submit chalega
    }
  };

  const evaluationStatus = isRecording ? "listening" : isSubmitting ? "processing" : "idle";

  if (isComplete) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-[#030712] via-[#070f2b] to-[#0f172a] text-[#eaecf0]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Interview Complete!</h2>
          <p className="mt-2 text-[#9aa1b4]">Thanks for your responses. We&apos;ll get back to you soon.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gradient-to-br from-[#030712] via-[#070f2b] to-[#0f172a] text-[#eaecf0]">
      <InterviewTopBar
        jobTitle={jobTitle}
        currentIndex={currentQuestionIdx}
        totalQuestions={questions.length}
      />

      {errorMsg && (
        <div className="mx-6 mt-4 flex items-center justify-between rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">
          <span>{errorMsg}</span>
          <button
            onClick={() => speakQuestion(questions[currentQuestionIdx])}
            className="ml-3 rounded-md bg-red-500/20 px-3 py-1 font-semibold hover:bg-red-500/30"
          >
            Retry
          </button>
        </div>
      )}

      <main className="flex flex-1 gap-6 overflow-hidden p-6">
        <div className="w-[55%]">
          <QuestionDisplay
            questionText={questions[currentQuestionIdx]}
            index={currentQuestionIdx}
            totalQuestions={questions.length}
            loading={loadingDisplayQuestion}
          />
        </div>

        <div className="flex w-[45%] flex-col gap-6">
          <div className="flex-1">
            <CameraSection isRecording={isRecording} />
          </div>
          <div className="flex-1">
            <EvaluationPanel status={evaluationStatus} feedbackItems={[]} />
          </div>
        </div>
      </main>

      <InterviewControlBar
        onNext={stopListeningManually}
        isLastQuestion={currentQuestionIdx === questions.length - 1}
        canProceed={isRecording}
      />
    </div>
  );
}