import { useState, useEffect } from "react";
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

  const [interviewID, setInterviewID] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loadingDisplayQuestion, setLoadingDisplayQuestion] = useState(false);

  const handleStartInterview = async () => {
    setLoadingDisplayQuestion(true);
    try {
      const response = await API.post("interview/startInterview", {
        jobTitle: jobTitle,
        jobDescription: jobDescription,
        experienceLevel: "mid", // typo bhi hai, niche dekho
        interviewType: "practice",
      });
      const interviewData = response.data.data.interview; // ek hi jagah se nikaalo, dono setters isi se feed hote hain

      setQuestions(interviewData.questions);
      setInterviewID(interviewData._id);
    } catch (error) {
      console.error(error);
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
}, []);

  const handleNextQuestion = () => {
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
    } else {
      alert("Mock Session Complete!");
    }
  };

  // UI-state hi hai — jab tum apna real recording/evaluation logic likhoge, isi variable ko wahan se drive karna
  const evaluationStatus = isRecording ? "listening" : "idle";

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gradient-to-br from-[#030712] via-[#070f2b] to-[#0f172a] text-[#eaecf0]">
      <InterviewTopBar
        jobTitle={jobTitle}
        currentIndex={currentQuestionIdx}
        totalQuestions={questions.length}
      />

      <main className="flex flex-1 gap-6 overflow-hidden p-6">
        {/* Left — Question panel, full height */}
        <div className="w-[55%]">
          <QuestionDisplay
            questionText={questions[currentQuestionIdx]}
            index={currentQuestionIdx}
            totalQuestions={questions.length}
            loading={loadingDisplayQuestion}
          />
        </div>

        {/* Right — Camera (top) + Evaluation (bottom), stacked */}
        <div className="flex w-[45%] flex-col gap-6">
          <div className="flex-1">
            <CameraSection
              isRecording={isRecording}
              onToggleRecording={() => setIsRecording((prev) => !prev)}
            />
          </div>
          <div className="flex-1">
            <EvaluationPanel status={evaluationStatus} feedbackItems={[]} />
          </div>
        </div>
      </main>

      <InterviewControlBar
        onNext={handleNextQuestion}
        isLastQuestion={currentQuestionIdx === questions.length - 1}
        canProceed={true}
      />
    </div>
  );
}
