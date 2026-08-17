import React from "react";
import { MessageSquareText } from "lucide-react";

export default function QuestionDisplay({
  questionText,
  index = 0,
  totalQuestions = 0,
  loading = false,
}) {
  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0d1538]/80 backdrop-blur-xl">
      
      {/* Top accent line */}
      <div className="h-1 shrink-0 bg-gradient-to-r from-[#d90000] via-red-500 to-indigo-500" />

      <div className="flex flex-1 flex-col overflow-hidden p-6">
        
        {/* Header */}
        <div className="flex shrink-0 items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#d90000] to-indigo-600">
            <MessageSquareText
              className="text-white"
              size={16}
            />
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[3px] text-[#d90000]">
              {totalQuestions > 0
                ? `Question ${index + 1} of ${totalQuestions}`
                : "Preparing Interview"}
            </p>

            <h3 className="text-sm font-semibold text-white">
              AI Generated Prompt
            </h3>
          </div>
        </div>

        {/* Question */}
        <div className="mt-5 flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-[#d90000]" />

                <p className="mt-4 text-sm text-[#eaecf0]/60">
                  Generating your interview questions...
                </p>
              </div>
            </div>
          ) : questionText ? (
            <p className="text-lg font-medium leading-8 text-[#eaecf0]">
              {questionText}
            </p>
          ) : (
            <div className="flex h-full items-center justify-center text-center">
              <p className="text-sm text-[#eaecf0]/50">
                Preparing your first question...
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}