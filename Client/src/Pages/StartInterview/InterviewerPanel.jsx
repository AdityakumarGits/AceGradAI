import { Bot, Radio } from "lucide-react";
import InterviewerImage from "../../assets/InterviewerImage.png"
export default function InterviewerPanel({
  isSpeaking,
  interviewerName = "MIRA",
}) {
  return (
    <div
      className={`relative flex h-full flex-col overflow-hidden rounded-xl border bg-[#0d1538]/80 p-5 backdrop-blur-xl transition-colors duration-300 ${
        isSpeaking ? "border-indigo-500" : "border-white/10"
      }`}
    >
      {/* Header — matches CameraSection's header pattern */}
      <div className="mb-3 flex items-center justify-between">
        {/* <div className="flex items-center gap-2">
          <Bot size={16} className="text-[#d90000]" />
          <span className="text-sm font-semibold text-white">
            Interviewer
          </span>
        </div> */}

        {isSpeaking && (
          <div className="flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-1">
            <Radio size={12} className="animate-pulse text-indigo-400" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400">
              Speaking
            </span>
          </div>
        )}
      </div>

      {/* Avatar */}
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center rounded-xl bg-white/5">
        <div
          className={`flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-[#d90000]/20 to-indigo-600/20 ring-2 transition-all duration-300 ${
            isSpeaking ? "ring-indigo-500" : "ring-white/10"
          }`}
        >
          <img  src={InterviewerImage} alt="Interviewer Image"
          className="rounded-full object-cover"
          />
          
        </div>
      </div>

      {/* Name label — bottom-left, matches CameraPreview's candidateName pill */}
      <div className="absolute bottom-5 left-5 rounded-full bg-black/60 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
        Interviewer ({interviewerName})
      </div>
    </div>
  );
}