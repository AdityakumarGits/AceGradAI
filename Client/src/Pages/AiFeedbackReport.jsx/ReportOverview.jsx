// src/pages/AIFeedbackReport/ReportOverview.jsx

import React from "react";
import { Award, Code2, MessageSquare, BrainCircuit } from "lucide-react";

export default function ReportOverview() {
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
              <p className="text-xs uppercase tracking-[3px] text-[#d90000] font-semibold">
                Overall Score
              </p>

              <h3 className="text-lg font-bold text-white">AI Fitment</h3>
            </div>
          </div>

          <div className="mt-8">
            <h1 className="text-6xl font-black text-white">82</h1>

            <p className="mt-2 text-[#eaecf0]/60">out of 100</p>
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-5">
            <span className="text-sm text-[#eaecf0]/60">Hiring Decision</span>

            <span className="rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2 text-sm font-semibold text-green-400">
              Strong Hire
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

        <h2 className="mt-3 text-4xl font-bold text-white">88%</h2>

        <p className="mt-5 text-sm leading-7 text-[#eaecf0]/60">
          Demonstrated strong understanding of React Hooks, asynchronous
          programming, component architecture, and modern frontend development.
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

        <h2 className="mt-3 text-4xl font-bold text-white">74%</h2>

        <p className="mt-5 text-sm leading-7 text-[#eaecf0]/60">
          Communication was clear overall, although a few responses contained
          brief pauses before the main explanation.
        </p>
      </div>

      {/* Keywords */}

      <div className="group rounded-3xl border border-white/10 bg-[#0d1538]/80 p-7 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-[#d90000]/40">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#d90000] to-indigo-600">
          <BrainCircuit className="text-white" />
        </div>

        <p className="mt-6 text-xs uppercase tracking-[3px] text-[#eaecf0]/50">
          Keyword Coverage
        </p>

        <h2 className="mt-3 text-4xl font-bold text-white">14 / 16</h2>

        <p className="mt-5 text-sm leading-7 text-[#eaecf0]/60">
          Successfully covered important concepts including Virtual DOM,
          Memoization, Hydration, Reconciliation, and React Hooks.
        </p>
      </div>
    </div>
  );
}
