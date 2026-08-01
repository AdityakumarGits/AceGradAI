import React, { useState } from "react";
import QuestionDisplay from "./QuestionDisplay";
import InterviewTopBar from "./InterviewTopBar";
import CameraSection from "./CameraSection";
import EvaluationPanel from "./EvaluationPanel";
import InterviewControlBar from "./InterviewControlBar";

export default function StartInterview() {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [isRecording, setIsRecording] = useState(false);

  const mockQuestions = [
    "Explain the concept of closures in JavaScript and provide a practical real-world use case.",
    "What is the difference between state and props in React, and how does data flow down the component tree?",
    "How does the Event Loop handle asynchronous operations in Node.js execution environments?",
  ];

  const handleNextQuestion = () => {
    if (currentQuestionIdx < mockQuestions.length - 1) {
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
        jobTitle="React Frontend Interview"
        currentIndex={currentQuestionIdx}
        totalQuestions={mockQuestions.length}
      />

      <main className="flex flex-1 gap-6 overflow-hidden p-6">
        {/* Left — Question panel, full height */}
        <div className="w-[55%]">
          <QuestionDisplay
            questionText={mockQuestions[currentQuestionIdx]}
            index={currentQuestionIdx}
            totalQuestions={mockQuestions.length}
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
        isLastQuestion={currentQuestionIdx === mockQuestions.length - 1}
        canProceed={true}
      />
    </div>
  );
}