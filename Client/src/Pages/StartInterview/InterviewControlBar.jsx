import { ArrowRight, Send, Square } from "lucide-react";

export default function InterviewControlBar({
  onNext,
  onStop,
  isRecording,
  isLastQuestion,
  canProceed,
}) {
  return (
    <div className="flex h-16 shrink-0 items-center justify-end border-t border-white/10 bg-[#0d1538]/90 px-8 backdrop-blur-xl">
      {isRecording ? (
        <button
          type="button"
          onClick={onStop}
          className="flex items-center gap-2 rounded-xl bg-[#d90000] px-6 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:scale-105"
        >
          <Square size={16} />
          Stop Recording
        </button>
      ) : (
        <button
          type="button"
          onClick={onNext}
          disabled={!canProceed}
          className={`flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold transition-all duration-300 ${
            canProceed
              ? "bg-gradient-to-r from-indigo-600 to-[#d90000] text-white hover:scale-105"
              : "cursor-not-allowed border border-white/10 bg-white/5 text-[#eaecf0]/30"
          }`}
        >
          {isLastQuestion ? (
            <>
              <Send size={16} />
              Submit & Evaluate
            </>
          ) : (
            <>
              Next Question
              <ArrowRight size={16} />
            </>
          )}
        </button>
      )}
    </div>
  );
}