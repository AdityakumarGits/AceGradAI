import React from "react";
import {
  Award,
  Code2,
  MessageSquare,
  BrainCircuit,
} from "lucide-react";

export default function ReportOverview({ evaluation }) {
  const overallScore = evaluation?.overallScore ?? 0;
  const technicalScore = evaluation?.technicalScore ?? 0;
  const communicationScore = evaluation?.communicationScore ?? 0;
  const problemSolvingScore = evaluation?.problemSolvingScore ?? 0;

  const getHiringDecision = (score) => {
    if (score >= 8.5) return "Strong Hire";
    if (score >= 7) return "Hire";
    if (score >= 5) return "Consider";
    return "Needs Improvement";
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">

      {/* Overall Score */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0d1538]/80 p-7 backdrop-blur-xl">

        <div className="absolute -top-16 -right-10 h-44 w-44 rounded-full bg-[#d90000]/20 blur-[100px]" />

        <div className="relative">

          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#d90000] to-indigo-600">
              <Award className="text-white" size={26} />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[3px] text-[#d90000]">
                Overall Score
              </p>

              <h3 className="text-lg font-bold text-white">
                AI Fitment
              </h3>
            </div>
          </div>

          <div className="mt-8">
            <h1 className="text-6xl font-black text-white">
              {overallScore}
            </h1>

            <p className="mt-2 text-[#eaecf0]/60">
              out of 10
            </p>
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-5">

            <span className="text-sm text-[#eaecf0]/60">
              Hiring Decision
            </span>

            <span
              className={`rounded-full border px-4 py-2 text-sm font-semibold ${
                overallScore >= 7
                  ? "border-green-500/30 bg-green-500/10 text-green-400"
                  : overallScore >= 5
                  ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-400"
                  : "border-red-500/30 bg-red-500/10 text-red-400"
              }`}
            >
              {getHiringDecision(overallScore)}
            </span>

          </div>
        </div>
      </div>

      {/* Technical */}
      <div className="group rounded-3xl border border-white/10 bg-[#0d1538]/80 p-7 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-[#d90000]/40">

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700">
          <Code2 className="text-white" />
        </div>

        <p className="mt-6 text-xs uppercase tracking-[3px] text-[#eaecf0]/50">
          Technical Depth
        </p>

        <h2 className="mt-3 text-4xl font-bold text-white">
          {technicalScore}/10
        </h2>

        <p className="mt-5 text-sm leading-7 text-[#eaecf0]/60">
          AI evaluation of the candidate's technical knowledge,
          accuracy, and understanding of the concepts discussed.
        </p>

      </div>

      {/* Communication */}
      <div className="group rounded-3xl border border-white/10 bg-[#0d1538]/80 p-7 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-indigo-500/40">

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#d90000] to-red-600">
          <MessageSquare className="text-white" />
        </div>

        <p className="mt-6 text-xs uppercase tracking-[3px] text-[#eaecf0]/50">
          Communication
        </p>

        <h2 className="mt-3 text-4xl font-bold text-white">
          {communicationScore}/10
        </h2>

        <p className="mt-5 text-sm leading-7 text-[#eaecf0]/60">
          AI evaluation of clarity, explanation quality,
          communication structure, and response delivery.
        </p>

      </div>

      {/* Problem Solving */}
      <div className="group rounded-3xl border border-white/10 bg-[#0d1538]/80 p-7 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-[#d90000]/40">

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#d90000] to-indigo-600">
          <BrainCircuit className="text-white" />
        </div>

        <p className="mt-6 text-xs uppercase tracking-[3px] text-[#eaecf0]/50">
          Problem Solving
        </p>

        <h2 className="mt-3 text-4xl font-bold text-white">
          {problemSolvingScore}/10
        </h2>

        <p className="mt-5 text-sm leading-7 text-[#eaecf0]/60">
          AI evaluation of logical thinking, reasoning,
          problem-solving approach, and technical decision making.
        </p>

      </div>

    </div>
  );
}