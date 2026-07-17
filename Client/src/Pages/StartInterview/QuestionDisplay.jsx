// src/pages/StartInterview/QuestionDisplay.jsx
import React from 'react';

export default function QuestionDisplay({ questionText, index }) {
  return (
    <div className="bg-slate-800/60 border border-slate-800 rounded-2xl p-8 flex flex-col justify-between shadow-xl relative overflow-hidden backdrop-blur-sm">
      <div className="space-y-6">
        <div className="flex items-center space-x-2 text-xs font-medium text-slate-400 uppercase tracking-widest">
          <span>📝</span> <span>Prompt Context Target</span>
        </div>
        
        {/* Main Prompt Text Container */}
        <div className="space-y-4">
          <span className="text-5xl font-extrabold text-indigo-500/30 font-mono block select-none">Q{index + 1}.</span>
          <p className="text-xl font-medium text-slate-100 leading-relaxed tracking-wide">
            {questionText}
          </p>
        </div>
      </div>

      {/* AI Assistant Context Note Footer */}
      <div className="mt-8 pt-6 border-t border-slate-700/40 bg-slate-900/30 -mx-8 -mb-8 p-6 flex items-start space-x-3">
        <span className="text-xl">💡</span>
        <div className="text-xs text-slate-400 leading-normal">
          <span className="text-indigo-400 font-semibold block mb-1">Evaluation Tips:</span>
          Speak clearly and state your architectural choices plainly. Your performance models map deep logic trees, keyword accuracy, and contextual delivery speeds.
        </div>
      </div>
    </div>
  );
}