// src/pages/StartInterview/TranscriptionPanel.jsx
import React from 'react';

export default function TranscriptionPanel({ 
  transcribedText, 
  setTranscribedText, 
  isRecording, 
  setIsRecording, 
  onNext,
  isLastQuestion 
}) {
  
  // Simulated speech mechanics handler toggles
  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      // Mock active live audio input simulation injection
      setTranscribedText(prev => prev + (prev ? " " : "") + "[Simulated live speech engine picking up voice token matrices... Everything spoken shows instantly here.]");
    } else {
      setIsRecording(false);
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 flex flex-col justify-between shadow-xl">
      <div className="flex-1 flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center space-x-2">
            <span className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-slate-500'}`}></span>
            <span>Real-time Audio Transcript Input</span>
          </label>
          {isRecording && (
            <span className="text-xs font-mono text-red-400 animate-pulse bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
              ● LIVE STREAMING
            </span>
          )}
        </div>

        {/* Dynamic Transcriber Alphanumeric Sandbox Field */}
        <textarea
          value={transcribedText}
          onChange={(e) => setTranscribedText(e.target.value)}
          placeholder="Click the microphone toggle button below to start tracking your answer. Alternatively, you can compose your points textually..."
          className="w-full flex-1 bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm leading-relaxed resize-none font-mono shadow-inner"
        />
      </div>

      {/* Action Controller Tray */}
      <div className="mt-6 pt-4 border-t border-slate-700/60 flex items-center justify-between">
        {/* Toggle Audio Button */}
        <button
          onClick={toggleRecording}
          className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-semibold text-sm transition-all shadow-md ${
            isRecording 
              ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/20 animate-pulse' 
              : 'bg-slate-900 border border-slate-700 text-slate-200 hover:bg-slate-700'
          }`}
        >
          <span>{isRecording ? '🛑 Stop Recording' : '🎙️ Start Mic Capture'}</span>
        </button>

        {/* Next Question Control */}
        <button
          onClick={onNext}
          disabled={!transcribedText.trim()}
          className={`px-6 py-3 rounded-xl text-sm font-semibold transition shadow-md active:scale-95 ${
            transcribedText.trim()
              ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20' 
              : 'bg-slate-700 text-slate-500 cursor-not-allowed shadow-none'
          }`}
        >
          {isLastQuestion ? 'Submit Interview 🏁' : 'Next Prompt →'}
        </button>
      </div>
    </div>
  );
}