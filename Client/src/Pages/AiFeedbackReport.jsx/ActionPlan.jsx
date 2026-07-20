// src/pages/AIFeedbackReport/ActionPlan.jsx

import React from "react";
import { Sparkles, TrendingUp, Target } from "lucide-react";

export default function ActionPlan() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0d1538]/80 backdrop-blur-xl">
      {/* Background Glow */}
      <div className="absolute -top-20 right-0 h-48 w-48 rounded-full bg-[#d90000]/20 blur-[110px]" />
      <div className="absolute bottom-0 -left-10 h-52 w-52 rounded-full bg-indigo-500/20 blur-[120px]" />
      <div className="relative p-8">
        {/* Header */}

        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#d90000] to-indigo-600">
              <Sparkles className="text-white" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white">
                AI Recommendations
              </h2>

              <p className="mt-1 text-sm text-[#eaecf0]/60">
                Personalized insights generated after your interview.
              </p>
            </div>
          </div>
        </div>

        {/* Strength */}

        <div className="mt-8 rounded-2xl border border-green-500/20 bg-green-500/10 p-5 transition-all duration-300 hover:border-green-500/40">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-500/20">
              <TrendingUp className="text-green-400" size={22} />
            </div>

            <h3 className="font-semibold text-green-400">Major Strengths</h3>
          </div>

          <p className="mt-4 text-sm leading-7 text-[#eaecf0]/70">
            Excellent explanation of JavaScript closures, lexical scope, and
            React Fiber architecture. Your technical reasoning remained
            consistent throughout the interview and your examples demonstrated
            strong practical knowledge.
          </p>
        </div>

        {/* Improvement */}

        <div className="mt-6 rounded-2xl border border-[#d90000]/20 bg-[#d90000]/10 p-5 transition-all duration-300 hover:border-[#d90000]/40">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#d90000]/20">
              <Target className="text-[#ff6b6b]" size={22} />
            </div>

            <h3 className="font-semibold text-[#ff8a8a]">
              Growth Opportunities
            </h3>
          </div>

          <p className="mt-4 text-sm leading-7 text-[#eaecf0]/70">
            Structure answers using the STAR method (Situation, Task, Action,
            Result). This will improve clarity, reduce pauses, and make your
            responses more impactful during behavioral and technical interviews.
          </p>
        </div>

        {/* Footer Tip */}

        <div className="mt-8 rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-5">
          <h4 className="font-semibold text-indigo-300">💡 AceGrad AI Tip</h4>

          <p className="mt-3 text-sm leading-7 text-[#eaecf0]/70">
            Practice 3–5 mock interviews every week and compare your AI reports.
            Consistent practice improves communication, confidence, and overall
            interview performance much faster than studying theory alone.
          </p>
        </div>
      </div>
    </div>
  );
}
