// src/pages/AIFeedbackReport/SkillBreakdown.jsx

import React from "react";
import {
  Code2,
  BrainCircuit,
  MessageSquareText,
  BadgeCheck,
} from "lucide-react";

export default function SkillBreakdown() {
  const metrics = [
    {
      label: "Technical Accuracy & Logic Structure",
      score: 88,
      icon: Code2,
      gradient: "from-indigo-500 to-indigo-700",
    },
    {
      label: "Problem Solving Methodologies",
      score: 80,
      icon: BrainCircuit,
      gradient: "from-[#d90000] to-indigo-600",
    },
    {
      label: "Communication & Speech Pacing",
      score: 74,
      icon: MessageSquareText,
      gradient: "from-[#d90000] to-red-500",
    },
    {
      label: "Confidence & Delivery Fluency",
      score: 85,
      icon: BadgeCheck,
      gradient: "from-indigo-500 to-[#d90000]",
    },
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0d1538]/80 backdrop-blur-xl">
      {/* Background Glow */}

      <div className="absolute -top-16 -left-16 h-52 w-52 rounded-full bg-[#d90000]/20 blur-[120px]" />

      <div className="absolute bottom-0 right-0 h-60 w-60 rounded-full bg-indigo-500/20 blur-[130px]" />

      <div className="relative p-8">
        {/* Header */}

        <div>
          <h2 className="text-2xl font-bold text-white">Skill Breakdown</h2>

          <p className="mt-2 text-[#eaecf0]/60">
            AI-generated evaluation across technical knowledge, communication,
            confidence, and problem-solving ability.
          </p>
        </div>

        {/* Metrics */}

        <div className="mt-8 space-y-7">
          {metrics.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="group rounded-2xl border border-white/10 bg-[#030712]/40 p-5 transition-all duration-300 hover:border-[#d90000]/30 hover:bg-white/5"
              >
                {/* Title */}

                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${item.gradient}`}
                    >
                      <Icon className="text-white" size={22} />
                    </div>

                    <div>
                      <h4 className="font-semibold text-white">{item.label}</h4>

                      <p className="text-xs text-[#eaecf0]/50">
                        AI Performance Metric
                      </p>
                    </div>
                  </div>

                  <span className="text-xl font-bold text-white">
                    {item.score}%
                  </span>
                </div>

                {/* Progress */}

                <div className="h-3 overflow-hidden rounded-full bg-white/10">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${item.gradient} transition-all duration-700`}
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
