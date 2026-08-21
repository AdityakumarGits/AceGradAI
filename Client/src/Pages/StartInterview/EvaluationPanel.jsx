import { Loader2 } from "lucide-react";

// Same 5 statuses as before — sirf text-mapping, koi per-status badge/icon nahi
const STATUS_TEXT = {
  idle: "Waiting for the next interview step...",
  speaking: "AI is asking the question...",
  listening: "Listening to your answer...",
  processing: "Processing your answer...",
  evaluating: "Evaluating your interview...",
};

export default function EvaluationPanel({ status = "idle", feedbackItems = [] }) {
  const statusText = STATUS_TEXT[status] || STATUS_TEXT.idle;
  const isSpinning = status === "processing" || status === "evaluating";

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0d1538]/80 p-5 backdrop-blur-xl">
      <span className="inline-block rounded bg-white/10 px-2 py-1 text-xs font-semibold text-white/70">
        Transcription
      </span>

      <div className="mt-3">
        {feedbackItems.length > 0 ? (
          <div className="space-y-3">
            {feedbackItems.map((item, index) => (
              <p key={index} className="text-sm leading-6 text-white/80">
                {item}
              </p>
            ))}
          </div>
        ) : (
          <p className="text-base font-medium leading-7 text-white/50">
            No feedback yet.
          </p>
        )}
      </div>

      <p className="mt-5 flex items-center justify-center gap-2 border-t border-white/10 pt-4 text-center text-sm text-white/40">
        {isSpinning && <Loader2 size={14} className="animate-spin" />}
        {statusText}
      </p>
    </div>
  );
}