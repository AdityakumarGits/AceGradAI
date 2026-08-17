import { BrainCircuit, CircleDot } from "lucide-react";

export default function InterviewTopBar({
  jobTitle,
  currentIndex = 0,
  totalQuestions = 0,
}) {
  const progress =
    totalQuestions > 0
      ? ((currentIndex + 1) / totalQuestions) * 100
      : 0;

  return (
    <header className="flex h-20 shrink-0 items-center justify-between border-b border-white/10 bg-[#0d1538]/80 px-8 backdrop-blur-xl">

      {/* Left */}
      <div className="flex items-center gap-4">
        
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#d90000] to-indigo-600">
          <BrainCircuit
            className="text-white"
            size={20}
          />
        </div>

        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-[#d90000]/30 bg-[#d90000]/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-[#d90000]">
            <CircleDot size={10} />
            Live Interview
          </span>

          <h1 className="mt-0.5 text-lg font-bold text-white">
            {jobTitle || "Mock Interview"}
          </h1>
        </div>
      </div>

      {/* Progress */}
      <div className="w-72">
        <div className="mb-2 flex items-center justify-between text-xs">
          
          <span className="text-[#eaecf0]/70">
            Question
          </span>

          <span className="font-semibold text-white">
            {totalQuestions > 0
              ? `${currentIndex + 1} / ${totalQuestions}`
              : "Preparing..."}
          </span>

        </div>

        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#d90000] to-indigo-500 transition-all duration-500"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </div>

    </header>
  );
}