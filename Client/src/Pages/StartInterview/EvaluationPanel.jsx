import {
  Sparkles,
  Radio,
  Loader2,
  Volume2,
} from "lucide-react";

const STATUS_CONFIG = {
  idle: {
    text: "Waiting for the next interview step...",
    icon: Sparkles,
  },

  speaking: {
    text: "AI is asking the question...",
    icon: Volume2,
  },

  listening: {
    text: "Listening to your answer...",
    icon: Radio,
  },

  processing: {
    text: "Processing your answer...",
    icon: Loader2,
  },

  evaluating: {
    text: "Evaluating your interview...",
    icon: Loader2,
  },
};

export default function EvaluationPanel({
  status = "idle",
  feedbackItems = [],
}) {
  const config =
    STATUS_CONFIG[status] ||
    STATUS_CONFIG.idle;

  const Icon = config.icon;

  const isSpinning =
    status === "processing" ||
    status === "evaluating";

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0d1538]/80 p-5 backdrop-blur-xl">

      {/* Header */}
      <div className="flex items-center justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#d90000]/10">
            <Sparkles
              size={16}
              className="text-[#d90000]"
            />
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[3px] text-[#d90000]">
              Live Evaluation
            </p>

            <h3 className="text-sm font-bold text-white">
              AI Feedback
            </h3>
          </div>

        </div>

        {/* Status badge */}
        {status === "speaking" && (
          <div className="flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-1">
            <Volume2
              size={12}
              className="text-indigo-400"
            />

            <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400">
              AI Speaking
            </span>
          </div>
        )}

        {status === "listening" && (
          <div className="flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-1">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />

            <span className="text-[10px] font-semibold uppercase tracking-wider text-red-400">
              Listening
            </span>
          </div>
        )}

        {status === "processing" && (
          <div className="flex items-center gap-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-2.5 py-1">
            <Loader2
              size={12}
              className="animate-spin text-yellow-400"
            />

            <span className="text-[10px] font-semibold uppercase tracking-wider text-yellow-400">
              Processing
            </span>
          </div>
        )}

      </div>

      {/* Content */}
      <div className="mt-4 flex-1 overflow-y-auto rounded-xl border border-white/10 bg-[#030712]/50 p-5">

        {feedbackItems.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">

            <Icon
              size={26}
              className={`mb-3 text-[rgba(234,236,240,0.3)] ${
                isSpinning
                  ? "animate-spin"
                  : ""
              }`}
            />

            <p className="text-sm text-[#eaecf0]/60">
              {config.text}
            </p>

          </div>
        ) : (
          <div className="space-y-3">

            {feedbackItems.map(
              (item, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-white/10 bg-white/5 p-4"
                >
                  <p className="text-sm leading-6 text-[#eaecf0]/80">
                    {item}
                  </p>
                </div>
              )
            )}

          </div>
        )}

      </div>

    </div>
  );
}