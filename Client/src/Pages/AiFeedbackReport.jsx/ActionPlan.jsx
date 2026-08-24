// src/pages/AIFeedbackReport/ActionPlan.jsx

import React from "react";
import {
  Sparkles,
  TrendingUp,
  Target,
  BookOpen,
} from "lucide-react";

export default function ActionPlan({ evaluation }) {
  const strengths = Array.isArray(evaluation?.strengths)
    ? evaluation.strengths
    : [];

  const weaknesses = Array.isArray(evaluation?.weaknesses)
    ? evaluation.weaknesses
    : [];

  const recommendedTopics = Array.isArray(
    evaluation?.recommendedTopics
  )
    ? evaluation.recommendedTopics
    : [];

  const feedbackSummary =
    typeof evaluation?.feedbackSummary === "string"
      ? evaluation.feedbackSummary
      : "";

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

        {/* Overall Feedback */}
        {feedbackSummary && (
          <div className="mt-8 rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/20">
                <Sparkles
                  className="text-indigo-400"
                  size={22}
                />
              </div>

              <h3 className="font-semibold text-indigo-300">
                Overall Feedback
              </h3>
            </div>

            <p className="mt-4 text-sm leading-7 text-[#eaecf0]/70">
              {feedbackSummary}
            </p>
          </div>
        )}

        {/* Strengths */}
        <div className="mt-6 rounded-2xl border border-green-500/20 bg-green-500/10 p-5 transition-all duration-300 hover:border-green-500/40">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-500/20">
              <TrendingUp
                className="text-green-400"
                size={22}
              />
            </div>

            <h3 className="font-semibold text-green-400">
              Major Strengths
            </h3>
          </div>

          {strengths.length > 0 ? (
            <ul className="mt-4 space-y-3">
              {strengths.map((strength, index) => (
                <li
                  key={`${index}-${strength}`}
                  className="flex items-start gap-3 text-sm leading-7 text-[#eaecf0]/70"
                >
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-green-400" />

                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-[#eaecf0]/50">
              No specific strengths were provided.
            </p>
          )}
        </div>

        {/* Weaknesses */}
        <div className="mt-6 rounded-2xl border border-[#d90000]/20 bg-[#d90000]/10 p-5 transition-all duration-300 hover:border-[#d90000]/40">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#d90000]/20">
              <Target
                className="text-[#ff6b6b]"
                size={22}
              />
            </div>

            <h3 className="font-semibold text-[#ff8a8a]">
              Growth Opportunities
            </h3>
          </div>

          {weaknesses.length > 0 ? (
            <ul className="mt-4 space-y-3">
              {weaknesses.map((weakness, index) => (
                <li
                  key={`${index}-${weakness}`}
                  className="flex items-start gap-3 text-sm leading-7 text-[#eaecf0]/70"
                >
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#ff6b6b]" />

                  <span>{weakness}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-[#eaecf0]/50">
              No specific improvement areas were provided.
            </p>
          )}
        </div>

        {/* Recommended Topics */}
        <div className="mt-6 rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/20">
              <BookOpen
                className="text-indigo-400"
                size={22}
              />
            </div>

            <h3 className="font-semibold text-indigo-300">
              Recommended Topics
            </h3>
          </div>

          {recommendedTopics.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {recommendedTopics.map((topic, index) => (
                <span
                  key={`${index}-${topic}`}
                  className="rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-2 text-xs text-indigo-200"
                >
                  {topic}
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-[#eaecf0]/50">
              No recommended topics available.
            </p>
          )}
        </div>

        {/* AceGrad Tip */}
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">
          <h4 className="font-semibold text-white">
            AceGrad AI Tip
          </h4>

          <p className="mt-3 text-sm leading-7 text-[#eaecf0]/60">
            Use the weaknesses and recommended topics above to focus
            your next practice session instead of repeating the same
            interview questions.
          </p>
        </div>
      </div>
    </div>
  );
}