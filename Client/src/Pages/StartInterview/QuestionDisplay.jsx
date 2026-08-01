import React from "react";
import { MessageSquareText } from "lucide-react";

export default function QuestionDisplay({ questionText, index, totalQuestions }) {
  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0d1538]/80 backdrop-blur-xl">
      {/* Top accent line */}
      <div className="h-1 shrink-0 bg-gradient-to-r from-[#d90000] via-red-500 to-indigo-500" />

      <div className="flex flex-1 flex-col overflow-hidden p-6">
        {/* Header */}
        <div className="flex shrink-0 items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#d90000] to-indigo-600">
            <MessageSquareText className="text-white" size={16} />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[3px] text-[#d90000] font-semibold">
              Question {index + 1}
              {totalQuestions ? ` of ${totalQuestions}` : ""}
            </p>
            <h3 className="text-sm font-semibold text-white">AI Generated Prompt</h3>
          </div>
        </div>

        {/* Question text — scrolls if long, fills remaining space */}
        <div className="mt-5 flex-1 overflow-y-auto">
          <p className="text-lg font-medium leading-8 text-[#eaecf0]">
            {questionText}
          </p>
        </div>
      </div>
    </div>
  );
}