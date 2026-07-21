// src/pages/StartInterview/QuestionDisplay.jsx

import React from "react";
import { MessageSquareText, Lightbulb } from "lucide-react";

export default function QuestionDisplay({ questionText, index }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0d1538]/80 backdrop-blur-xl">
      {/* Background Glow */}

      <div className="absolute -top-20 -left-20 h-56 w-56 rounded-full bg-[#d90000]/20 blur-[120px]" />

      <div className="absolute -bottom-20 right-0 h-64 w-64 rounded-full bg-indigo-500/20 blur-[140px]" />

      {/* Top Gradient */}

      <div className="h-1 bg-gradient-to-r from-[#d90000] via-red-500 to-indigo-500" />

      <div className="relative p-8">
        {/* Header */}

        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#d90000] to-indigo-600 shadow-lg">
            <MessageSquareText className="text-white" size={22} />
          </div>

          <div>
            <p className="text-xs uppercase tracking-[3px] text-[#d90000] font-semibold">
              Interview Question
            </p>

            <h3 className="text-lg font-semibold text-white">
              AI Generated Prompt
            </h3>
          </div>
        </div>

        {/* Question */}

        <div className="mt-10">
          <span className="block text-6xl font-extrabold bg-gradient-to-r from-[#d90000]/30 to-indigo-400/30 bg-clip-text text-transparent select-none">
            Q{index + 1}
          </span>

          <p className="mt-6 text-2xl leading-10 font-medium text-[#eaecf0]">
            {questionText}
          </p>
        </div>
      </div>

      {/* Footer */}

      <div className="relative border-t border-white/10 bg-[#030712]/50 px-8 py-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#d90000]/10">
            <Lightbulb className="text-[#d90000]" size={24} />
          </div>

          <div>
            <h4 className="font-semibold text-white">AI Evaluation Tips</h4>

            <p className="mt-2 text-sm leading-7 text-[#eaecf0]/70">
              Answer confidently with a clear structure. Explain your thought
              process, justify technical decisions, and communicate naturally.
              AceGrad AI evaluates clarity, technical accuracy, confidence, and
              overall communication quality.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
