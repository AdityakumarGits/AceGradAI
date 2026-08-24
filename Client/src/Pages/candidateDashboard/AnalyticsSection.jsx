import React from "react";
import {
  Code2,
  BrainCircuit,
  MessageSquareText,
  Trophy,
} from "lucide-react";

export default function AnalyticsSection({
  interviews = [],
  loading = false,
}) {
  const completedInterviews = interviews.filter(
    (item) =>
      item?.evaluation ||
      item?.overallScore != null
  );

  const getEvaluation = (item) =>
    item?.evaluation || item || {};

  const average = (key) => {
    const values = completedInterviews
      .map((item) => Number(getEvaluation(item)?.[key]))
      .filter((value) => !Number.isNaN(value));

    if (!values.length) return 0;

    return Math.round(
      (values.reduce((sum, value) => sum + value, 0) /
        values.length) *
        10
    ) / 10;
  };

  const technicalScore = average("technicalScore");
  const communicationScore = average("communicationScore");
  const problemSolvingScore = average("problemSolvingScore");
  const overallScore = average("overallScore");

  const skills = [
    {
      skill: "Technical Accuracy",
      level: technicalScore,
      icon: Code2,
      color: "from-indigo-500 to-indigo-400",
    },
    {
      skill: "Communication Clarity",
      level: communicationScore,
      icon: MessageSquareText,
      color: "from-[#d90000] to-red-500",
    },
    {
      skill: "Problem Solving",
      level: problemSolvingScore,
      icon: BrainCircuit,
      color: "from-indigo-500 to-[#d90000]",
    },
    {
      skill: "Overall Performance",
      level: overallScore,
      icon: Trophy,
      color: "from-[#d90000] to-indigo-500",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="h-[500px] animate-pulse rounded-3xl bg-[#0d1538]/80 lg:col-span-2" />
        <div className="h-[500px] animate-pulse rounded-3xl bg-[#0d1538]/80" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Skill Mapping */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0d1538]/80 p-8 backdrop-blur-xl lg:col-span-2">
        <div className="absolute -left-16 -top-16 h-44 w-44 rounded-full bg-[#d90000]/20 blur-[100px]" />

        <div className="absolute -bottom-20 -right-16 h-52 w-52 rounded-full bg-indigo-500/20 blur-[120px]" />

        <div className="relative">
          <h2 className="text-2xl font-bold text-white">
            Skill Performance
          </h2>

          <p className="mt-2 text-sm text-[#eaecf0]/60">
            Average performance calculated from your completed
            AI interview evaluations.
          </p>

          {completedInterviews.length === 0 ? (
            <div className="mt-10 rounded-2xl border border-white/10 bg-[#030712]/40 p-8 text-center">
              <p className="text-[#eaecf0]/50">
                Complete an interview to generate analytics.
              </p>
            </div>
          ) : (
            <div className="mt-8 space-y-7">
              {skills.map((skill, index) => {
                const Icon = skill.icon;
                const percentage = Math.min(
                  Math.max(skill.level * 10, 0),
                  100
                );

                return (
                  <div key={index}>
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${skill.color}`}
                        >
                          <Icon
                            size={18}
                            className="text-white"
                          />
                        </div>

                        <span className="font-medium text-[#eaecf0]">
                          {skill.skill}
                        </span>
                      </div>

                      <span className="font-semibold text-[#d90000]">
                        {skill.level}/10
                      </span>
                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-[#030712]">
                      <div
                        style={{
                          width: `${percentage}%`,
                        }}
                        className={`h-full rounded-full bg-gradient-to-r ${skill.color} transition-all duration-700`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0d1538]/80 p-8 backdrop-blur-xl">
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-[#d90000]/20 blur-[100px]" />

        <div className="relative">
          <h2 className="text-2xl font-bold text-white">
            Performance Summary
          </h2>

          <p className="mt-2 text-sm text-[#eaecf0]/60">
            Current performance snapshot based on your interview
            history.
          </p>

          <div className="mt-8 space-y-5">
            <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-4">
              <p className="text-sm text-[#eaecf0]/80">
                Overall average score
              </p>

              <p className="mt-2 text-2xl font-bold text-green-400">
                {overallScore}/10
              </p>
            </div>

            <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-4">
              <p className="text-sm text-[#eaecf0]/80">
                Technical average
              </p>

              <p className="mt-2 text-2xl font-bold text-indigo-300">
                {technicalScore}/10
              </p>
            </div>

            <div className="rounded-2xl border border-[#d90000]/20 bg-[#d90000]/10 p-4">
              <p className="text-sm text-[#eaecf0]/80">
                Communication average
              </p>

              <p className="mt-2 text-2xl font-bold text-[#ff8a8a]">
                {communicationScore}/10
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-[#eaecf0]/60">
                Interviews analyzed
              </p>

              <p className="mt-2 text-2xl font-bold text-white">
                {completedInterviews.length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}