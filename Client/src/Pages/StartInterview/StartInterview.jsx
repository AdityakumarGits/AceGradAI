// src/pages/StartInterview/StartInterview.jsx
import React, { useState } from 'react';
import QuestionDisplay from './QuestionDisplay';
import TranscriptionPanel from './TranscriptionPanel';

export default function StartInterview() {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  
  // Dummy data representing incoming prompt queues from our AI engine
  const mockQuestions = [
    "Explain the concept of closures in JavaScript and provide a practical real-world use case.",
    "What is the difference between state and props in React, and how does data flow down the component tree?",
    "How does the Event Loop handle asynchronous operations in Node.js execution environments?"
  ];

  const handleNextQuestion = () => {
    if (currentQuestionIdx < mockQuestions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setTranscribedText(''); // Clearing sandbox state fields for next question
    } else {
      alert("Mock Session Complete! Initializing AI performance tracking report...");
      // Logic for moving to full analytics dashboard report goes here
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col">
      {/* Dynamic Header Frame */}
      <header className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex justify-between items-center shadow-md">
        <div className="flex items-center space-x-3">
          <span className="bg-indigo-600/20 text-indigo-400 px-3 py-1 rounded-md text-xs font-mono uppercase tracking-wider border border-indigo-500/20">
            Live Sandbox
          </span>
          <h1 className="text-md font-semibold text-slate-200">React Frontend Campaign</h1>
        </div>
        
        {/* Progress Tracker */}
        <div className="flex items-center space-x-6 text-sm">
          <div className="text-slate-400">
            Question <span className="text-white font-bold">{currentQuestionIdx + 1}</span> of <span className="text-slate-400">{mockQuestions.length}</span>
          </div>
          <div className="h-2 w-32 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-500 transition-all duration-300"
              style={{ width: `${((currentQuestionIdx + 1) / mockQuestions.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </header>

      {/* Main Execution Arena Split view */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 overflow-hidden">
        {/* Left Side: Question Delivery */}
        <QuestionDisplay 
          questionText={mockQuestions[currentQuestionIdx]} 
          index={currentQuestionIdx} 
        />

        {/* Right Side: Voice Capture Interface */}
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