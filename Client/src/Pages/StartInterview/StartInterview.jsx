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
  const [isRecording, setIsRecording] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const [interviewID, setInterviewID] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loadingDisplayQuestion, setLoadingDisplayQuestion] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // refs — UI re-render inke liye zaroori nahi
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

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
useEffect(() => {
  if (questions.length > 0 && !isComplete) {
    startRecording();
  }
}, [currentQuestionIdx, questions]); // 'questions' add karna hai

  const startRecording = async () => {
    try {
      // 1. Mic permission maango, stream lo
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // 2. Us stream ko MediaRecorder ko do
      const recorder = new MediaRecorder(stream);

      // 3. Naye question ke liye purane chunks clear karo
      audioChunksRef.current = [];

      // 4. Jab bhi audio ka piece available ho, array me push karo
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // 5. Recording stop hote hi ye chalega — set karo start() se PEHLE
      recorder.onstop = async () => {
        // stream ke tracks band karo — mic ka indicator light off ho jayega
        stream.getTracks().forEach((track) => track.stop());

        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });

        setIsSubmitting(true);
        setErrorMsg(null);

        const formData = new FormData();
        formData.append("interviewId", interviewID);
        formData.append("audio", audioBlob, "answer.webm");

        try {
          await API.post("interview/submitAnswer", formData, {
            headers: { "Content-Type": "multipart/form-data" },
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

      // 6. mediaRecorderRef me store karo taaki stopRecording ise access kar sake
      mediaRecorderRef.current = recorder;

      // 7. Recording actually start karo
      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Mic access failed:", err);
      setErrorMsg("Microphone access denied. Please allow mic access and retry.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop(); // isse onstop trigger hoga (submit wahin hota hai)
    }
    setIsRecording(false);
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
      onClick={startRecording}
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
            <CameraSection
              isRecording={isRecording}
              onToggleRecording={() => (isRecording ? stopRecording() : startRecording())}
            />
          </div>
          <div className="flex-1">
            <EvaluationPanel status={evaluationStatus} feedbackItems={[]} />
          </div>
        </div>
      </main>

      <InterviewControlBar
        onNext={stopRecording}
        isLastQuestion={currentQuestionIdx === questions.length - 1}
        canProceed={isRecording}
      />
    </div>
  );
}