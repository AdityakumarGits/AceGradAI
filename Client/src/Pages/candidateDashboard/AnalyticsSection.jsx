// src/pages/CandidateDashboard/AnalyticsSection.jsx

import React from "react";

export default function AnalyticsSection() {
  const skills = [
    {
      skill: "Technical Accuracy",
      level: "85%",
      color: "from-indigo-500 to-indigo-400",
    },
    {
      skill: "Communication Clarity",
      level: "72%",
      color: "from-[#d90000] to-red-500",
    },
    {
      skill: "Confidence & Speech Pacing",
      level: "79%",
      color: "from-indigo-500 to-[#d90000]",
    },
    {
      skill: "Structural Integrity",
      level: "64%",
      color: "from-[#d90000] to-indigo-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Skill Mapping */}

      <div className="lg:col-span-2 relative overflow-hidden rounded-3xl border border-white/10 bg-[#0d1538]/80 backdrop-blur-xl p-8">
        <div className="absolute -top-16 -left-16 h-44 w-44 rounded-full bg-[#d90000]/20 blur-[100px]" />

        <div className="absolute -bottom-20 -right-16 h-52 w-52 rounded-full bg-indigo-500/20 blur-[120px]" />

        <div className="relative">
          <h2 className="text-2xl font-bold text-white">
            Skill Vector Mapping
          </h2>

          <p className="mt-2 text-sm text-[#eaecf0]/60">
            AI evaluates your previous interview performance across multiple
            communication and technical dimensions.
          </p>

          <div className="mt-8 space-y-7">
            {skills.map((skill, index) => (
              <div key={index}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-medium text-[#eaecf0]">
                    {skill.skill}
                  </span>

                  <span className="text-[#d90000] font-semibold">
                    {skill.level}
                  </span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-[#030712]">
                  <div
                    style={{ width: skill.level }}
                    className={`h-full rounded-full bg-gradient-to-r ${skill.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Summary */}

      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0d1538]/80 backdrop-blur-xl p-8">
        <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-[#d90000]/20 blur-[100px]" />

        <div className="relative">
          <h2 className="text-2xl font-bold text-white">
            AI Recruiter Summary
          </h2>

          <p className="mt-2 text-sm text-[#eaecf0]/60">
            Personalized insights generated from your interview history.
          </p>

          <div className="mt-8 space-y-5">
            <div className="flex gap-3 rounded-2xl border border-green-500/20 bg-green-500/10 p-4">
              <span className="text-xl">✅</span>

              <p className="text-sm leading-6 text-[#eaecf0]/80">
                Strong understanding of React, JavaScript fundamentals, and
                component architecture.
              </p>
            </div>

            <div className="flex gap-3 rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-4">
              <span className="text-xl">⚠️</span>

              <p className="text-sm leading-6 text-[#eaecf0]/80">
                Improve confidence while explaining asynchronous operations and
                state management.
              </p>
            </div>

            <div className="flex gap-3 rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-4">
              <span className="text-xl">🚀</span>

              <p className="text-sm leading-6 text-[#eaecf0]/80">
                Communication pace and confidence have improved significantly
                over the last few interviews.
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-[#d90000]/20 bg-[#030712]/60 p-4 text-center">
            <p className="text-sm italic text-[#eaecf0]/60">
              AI continuously analyzes your interviews to generate actionable
              recommendations and highlight improvement trends.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
