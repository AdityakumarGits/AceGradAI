// src/Pages/candidateDashboard/AnalyticsSection.jsx

import React from "react";

export default function AnalyticsSection({
  interviews = [],
  loading,
}) {
  // --------------------------------------------------
  // Get Completed Interviews
  // --------------------------------------------------

  const evaluatedInterviews = interviews.filter(
    (item) =>
      item?.evaluation ||
      item?.technicalScore !== undefined ||
      item?.communicationScore !== undefined ||
      item?.problemSolvingScore !== undefined
  );

  // --------------------------------------------------
  // Average Helper
  // --------------------------------------------------

  const getAverage = (field) => {
    const values = evaluatedInterviews
      .map((item) =>
        Number(
          item?.evaluation?.[field] ??
            item?.[field] ??
            0
        )
      )
      .filter((value) => value > 0);

    if (values.length === 0) return 0;

    return (
      Math.round(
        (values.reduce((sum, value) => sum + value, 0) /
          values.length) *
          10
      ) / 10
    );
  };

  const technicalScore = getAverage(
    "technicalScore"
  );

  const communicationScore = getAverage(
    "communicationScore"
  );

  const problemSolvingScore = getAverage(
    "problemSolvingScore"
  );

  const overallScore = getAverage(
    "overallScore"
  );

  // --------------------------------------------------
  // Skill Mapping
  // --------------------------------------------------

  const skills = [
    {
      skill: "Technical Accuracy",
      score: technicalScore,
      color: "from-indigo-500 to-indigo-400",
    },
    {
      skill: "Communication Clarity",
      score: communicationScore,
      color: "from-[#d90000] to-red-500",
    },
    {
      skill: "Problem Solving",
      score: problemSolvingScore,
      color: "from-indigo-500 to-[#d90000]",
    },
    {
      skill: "Overall Performance",
      score: overallScore,
      color: "from-[#d90000] to-indigo-500",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        <div className="h-[450px] animate-pulse rounded-3xl bg-[#0d1538]/80 lg:col-span-2" />

        <div className="h-[450px] animate-pulse rounded-3xl bg-[#0d1538]/80" />

      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

      {/* =====================================================
          SKILL MAPPING
      ====================================================== */}

      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0d1538]/80 p-8 backdrop-blur-xl lg:col-span-2">

        <div className="absolute -left-16 -top-16 h-44 w-44 rounded-full bg-[#d90000]/20 blur-[100px]" />

        <div className="absolute -bottom-20 -right-16 h-52 w-52 rounded-full bg-indigo-500/20 blur-[120px]" />

        <div className="relative">

          <h2 className="text-2xl font-bold text-white">
            Skill Vector Mapping
          </h2>

          <p className="mt-2 text-sm text-[#eaecf0]/60">
            AI evaluates your previous interview performance
            across multiple technical and communication
            dimensions.
          </p>

          <div className="mt-8 space-y-7">

            {skills.map((skill, index) => {

              const percentage = Math.min(
                skill.score * 10,
                100
              );

              return (
                <div key={index}>

                  <div className="mb-2 flex items-center justify-between">

                    <span className="font-medium text-[#eaecf0]">
                      {skill.skill}
                    </span>

                    <span className="font-semibold text-[#d90000]">
                      {skill.score}/10
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

        </div>

      </div>

      {/* =====================================================
          AI SUMMARY
      ====================================================== */}

      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0d1538]/80 p-8 backdrop-blur-xl">

        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-[#d90000]/20 blur-[100px]" />

        <div className="relative">

          <h2 className="text-2xl font-bold text-white">
            AI Performance Summary
          </h2>

          <p className="mt-2 text-sm text-[#eaecf0]/60">
            Aggregated insights from your completed interviews.
          </p>

          {evaluatedInterviews.length === 0 ? (

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">

              <p className="text-sm leading-6 text-[#eaecf0]/60">
                Complete an interview to generate AI
                performance analytics.
              </p>

            </div>

          ) : (

            <div className="mt-8 space-y-5">

              <div className="flex gap-3 rounded-2xl border border-green-500/20 bg-green-500/10 p-4">

                <span className="text-xl">
                  ✓
                </span>

                <p className="text-sm leading-6 text-[#eaecf0]/80">

                  Your average technical score is{" "}
                  <strong className="text-green-400">
                    {technicalScore}/10
                  </strong>
                  .

                </p>

              </div>

              <div className="flex gap-3 rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-4">

                <span className="text-xl">
                  ◈
                </span>

                <p className="text-sm leading-6 text-[#eaecf0]/80">

                  Your average communication score is{" "}
                  <strong className="text-indigo-300">
                    {communicationScore}/10
                  </strong>
                  .

                </p>

              </div>

              <div className="flex gap-3 rounded-2xl border border-[#d90000]/20 bg-[#d90000]/10 p-4">

                <span className="text-xl">
                  ↑
                </span>

                <p className="text-sm leading-6 text-[#eaecf0]/80">

                  Your overall interview performance is{" "}
                  <strong className="text-[#ff8a8a]">
                    {overallScore}/10
                  </strong>
                  .

                </p>

              </div>

            </div>
          )}

          <div className="mt-8 rounded-2xl border border-[#d90000]/20 bg-[#030712]/60 p-4 text-center">

            <p className="text-sm italic text-[#eaecf0]/60">
              Complete more interviews to build a more
              meaningful performance trend.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}