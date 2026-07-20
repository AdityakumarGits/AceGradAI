// src/pages/AIFeedbackReport/AIFeedbackReport.jsx

import React from "react";
import {
  FileBarChart,
  Download,
  LayoutDashboard,
  CalendarDays,
  Briefcase,
  User,
} from "lucide-react";

import ReportOverview from "./ReportOverview";
import SkillBreakdown from "./SkillBreakdown";
import TranscriptCritique from "./TranscriptCritique";
import ActionPlan from "./ActionPlan";

export default function AIFeedbackReport() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#030712] via-[#070f2b] to-[#0f172a] text-[#eaecf0]">
      {/* Background Glow */}

      <div className="absolute -top-40 -left-32 h-96 w-96 rounded-full bg-[#d90000]/15 blur-[180px]" />
      <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-indigo-600/15 blur-[220px]" />
      <div className="relative z-10 p-8 space-y-8">
        {/* Header */}

        <header className="rounded-3xl border border-white/10 bg-[#0d1538]/80 backdrop-blur-xl p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            {/* Left */}

            <div>
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#d90000] to-indigo-600 shadow-lg">
                  <FileBarChart className="text-white" size={28} />
                </div>

                <div>
                  <h1 className="text-3xl font-bold text-white">
                    AI Interview Evaluation Report
                  </h1>

                  <p className="mt-2 text-[#eaecf0]/60">
                    Comprehensive AI-generated interview performance analysis.
                  </p>
                </div>
              </div>

              {/* Candidate Information */}

              <div className="mt-6 flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                  <User size={16} className="text-[#d90000]" />

                  <span>John Doe</span>
                </div>

                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                  <Briefcase size={16} className="text-indigo-400" />

                  <span>Frontend Engineer (React)</span>
                </div>

                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                  <CalendarDays size={16} className="text-[#d90000]" />

                  <span>20 July 2026</span>
                </div>
              </div>
            </div>

            {/* Buttons */}

            <div className="flex gap-4">
              <button className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-white transition-all duration-300 hover:bg-white/10">
                <Download size={18} />
                Download PDF
              </button>

              <button className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[#d90000] to-indigo-600 px-6 py-4 font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-[0_0_35px_rgba(217,0,0,.35)]">
                <LayoutDashboard size={18} />
                Back to Dashboard
              </button>
            </div>
          </div>
        </header>

        {/* Overview */}

        <ReportOverview />

        {/* Middle */}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SkillBreakdown />
          </div>

          <div>
            <ActionPlan />
          </div>
        </div>

        {/* Transcript */}

        <TranscriptCritique />
      </div>
    </div>
  );
}
