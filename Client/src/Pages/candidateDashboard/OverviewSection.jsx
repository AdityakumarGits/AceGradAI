import React from "react";
import {
  Trophy,
  Target,
  Clock3,
  Code2,
  Rocket,
  ArrowRight,
} from "lucide-react";

export default function OverviewSection({
  interviews = [],
  loading = false,
  setActiveTab,
  onStartInterview,
}) {
  const completedInterviews = interviews.filter(
    (item) =>
      item.status === "completed" ||
      item.status === "Completed" ||
      item.isCompleted === true
  );

  const scoredInterviews = interviews.filter(
    (item) =>
      item?.evaluation?.overallScore != null ||
      item?.overallScore != null
  );

  const getScore = (interview) =>
    Number(
      interview?.evaluation?.overallScore ??
        interview?.overallScore ??
        interview?.score ??
        0
    );

  const averageScore =
    scoredInterviews.length > 0
      ? Math.round(
          scoredInterviews.reduce(
            (total, interview) => total + getScore(interview),
            0
          ) / scoredInterviews.length
        )
      : 0;

  const totalPracticeTime = interviews.reduce(
    (total, interview) =>
      total +
      Number(
        interview?.duration ??
          interview?.durationMinutes ??
          interview?.practiceTime ??
          0
      ),
    0
  );

  const latestInterview = interviews.length > 0 ? interviews[0] : null;

  const targetPosition =
    latestInterview?.jobRole ||
    latestInterview?.position ||
    latestInterview?.targetPosition ||
    "Not Set";

  const stats = [
    {
      label: "Average AI Score",
      value: `${averageScore}/10`,
      icon: Trophy,
      color: "from-[#d90000] to-red-600",
    },
    {
      label: "Interviews Taken",
      value: completedInterviews.length,
      icon: Target,
      color: "from-indigo-500 to-indigo-700",
    },
    {
      label: "Practice Time",
      value: `${totalPracticeTime} min`,
      icon: Clock3,
      color: "from-[#d90000] to-indigo-600",
    },
    {
      label: "Target Position",
      value: targetPosition,
      icon: Code2,
      color: "from-indigo-500 to-[#d90000]",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-40 animate-pulse rounded-3xl border border-white/10 bg-[#0d1538]/80"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0d1538]/80 p-8 backdrop-blur-xl">
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[#d90000]/20 blur-[130px]" />
        <div className="absolute -bottom-20 right-0 h-72 w-72 rounded-full bg-indigo-600/20 blur-[150px]" />

        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="font-medium uppercase tracking-[3px] text-[#d90000]">
              AI Mock Interview
            </p>

            <h2 className="mt-4 text-4xl font-bold leading-tight text-white">
              Ready to Ace Your
              <span className="bg-gradient-to-r from-[#d90000] to-indigo-400 bg-clip-text text-transparent">
                {" "}
                Next Interview?
              </span>
            </h2>

            <p className="mt-5 max-w-xl leading-8 text-[#eaecf0]/70">
              Practice with AI-powered interview simulations, receive
              instant performance analytics, and improve your confidence
              before your real interview.
            </p>

            <button
              type="button"
              onClick={onStartInterview}
              className="mt-8 flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[#d90000] to-indigo-600 px-8 py-4 font-semibold text-white transition duration-300 hover:scale-105 hover:shadow-[0_0_35px_rgba(217,0,0,.35)]"
            >
              <Rocket size={20} />
              Start Interview
            </button>
          </div>

          <div className="hidden lg:flex">
            <div className="flex h-40 w-40 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-[#d90000]/20 to-indigo-600/20">
              <Rocket size={70} className="text-[#d90000]" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">
            Performance Overview
          </h2>

          <p className="text-sm text-[#eaecf0]/60">
            Based on your interview history
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <div
                key={index}
                className="group rounded-3xl border border-white/10 bg-[#0d1538]/80 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-[#d90000]/40"
              >
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${stat.color}`}
                >
                  <Icon size={26} className="text-white" />
                </div>

                <p className="mt-6 text-sm text-[#eaecf0]/60">
                  {stat.label}
                </p>

                <h3 className="mt-2 truncate text-3xl font-bold text-white">
                  {stat.value}
                </h3>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom */}
      <div className="rounded-3xl border border-white/10 bg-[#0d1538]/80 p-6 backdrop-blur-xl">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-xl font-semibold text-white">
              Review Your Previous Interviews
            </h3>

            <p className="mt-2 text-[#eaecf0]/60">
              Explore detailed AI reports, feedback, and performance
              analytics from your completed interview sessions.
            </p>
          </div>

          <button
            onClick={() => setActiveTab("history")}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#d90000] to-indigo-600 px-6 py-3 font-semibold text-white transition duration-300 hover:scale-105"
          >
            View History
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}