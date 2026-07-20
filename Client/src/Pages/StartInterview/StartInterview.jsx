// src/pages/StartInterview/StartInterview.jsx

import React, { useState } from "react";
import { BrainCircuit, CircleDot } from "lucide-react";

import QuestionDisplay from "./QuestionDisplay";
import TranscriptionPanel from "./TranscriptionPanel";

export default function StartInterview() {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [transcribedText, setTranscribedText] = useState("");

  const mockQuestions = [
    "Explain the concept of closures in JavaScript and provide a practical real-world use case.",

    "What is the difference between state and props in React, and how does data flow down the component tree?",

    "How does the Event Loop handle asynchronous operations in Node.js execution environments?",
  ];

  const handleNextQuestion = () => {
    if (currentQuestionIdx < mockQuestions.length - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
      setTranscribedText("");
    } else {
      alert(
        "Mock Session Complete! Initializing AI performance tracking report...",
      );
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#030712] via-[#070f2b] to-[#0f172a] text-[#eaecf0]">
      {/* Background Glow */}

      <div className="absolute -top-40 -left-32 h-96 w-96 rounded-full bg-[#d90000]/15 blur-[180px]" />

      <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-indigo-600/15 blur-[220px]" />

      {/* Header */}

      <header className="relative z-10 border-b border-white/10 bg-[#0d1538]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">
          {/* Left */}

          <div className="flex items-center gap-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#d90000] to-indigo-600 shadow-lg">
              <BrainCircuit className="text-white" size={28} />
            </div>

            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#d90000]/30 bg-[#d90000]/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#d90000]">
                <CircleDot size={12} />
                Live Interview
              </span>

              <h1 className="mt-2 text-2xl font-bold text-white">
                React Frontend Interview
              </h1>
            </div>
          </div>

          {/* Right */}

          <div className="w-80">
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="text-[#eaecf0]/70">Question</span>

              <span className="font-semibold text-white">
                {currentQuestionIdx + 1} / {mockQuestions.length}
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#d90000] to-indigo-500 transition-all duration-500"
                style={{
                  width: `${
                    ((currentQuestionIdx + 1) / mockQuestions.length) * 100
                  }%`,
                }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main */}

      <main className="relative z-10 mx-auto grid max-w-7xl flex-1 grid-cols-1 gap-8 p-8 lg:grid-cols-2">
        <QuestionDisplay
          questionText={mockQuestions[currentQuestionIdx]}
          index={currentQuestionIdx}
        />

        <TranscriptionPanel
          transcribedText={transcribedText}
          setTranscribedText={setTranscribedText}
          isRecording={isRecording}
          setIsRecording={setIsRecording}
          onNext={handleNextQuestion}
          isLastQuestion={currentQuestionIdx === mockQuestions.length - 1}
        />
      </main>
    </div>
  );
}
