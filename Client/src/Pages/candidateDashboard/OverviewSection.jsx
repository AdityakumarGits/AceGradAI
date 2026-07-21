// src/pages/CandidateDashboard/OverviewSection.jsx

import React from "react";
import {
  Trophy,
  Target,
  Clock3,
  Code2,
  Rocket,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function OverviewSection({ setActiveTab }) {
  const stats = [
    {
      label: "Average AI Score",
      value: "78%",
      icon: Trophy,
      color: "from-[#d90000] to-red-600",
    },
    {
      label: "Interviews Taken",
      value: "12",
      icon: Target,
      color: "from-indigo-500 to-indigo-700",
    },
    {
      label: "Practice Time",
      value: "240 min",
      icon: Clock3,
      color: "from-[#d90000] to-indigo-600",
    },
    {
      label: "Target Position",
      value: "React Dev",
      icon: Code2,
      color: "from-indigo-500 to-[#d90000]",
    },
  ];

  return (
    <div className="space-y-8">

      {/* Hero Card */}

      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0d1538]/80 backdrop-blur-xl p-8">

        {/* Glow */}

        <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-[#d90000]/20 blur-[130px]" />

        <div className="absolute -bottom-20 right-0 h-72 w-72 rounded-full bg-indigo-600/20 blur-[150px]" />

        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between">

          <div className="max-w-2xl">

            <p className="font-medium uppercase tracking-[3px] text-[#d90000]">
              AI Mock Interview
            </p>

            <h2 className="mt-4 text-4xl font-bold leading-tight text-white">

              Ready to Ace Your
              <span className="bg-gradient-to-r from-[#d90000] to-indigo-400 bg-clip-text text-transparent">
                {" "}Next Interview?
              </span>

            </h2>

            <p className="mt-5 max-w-xl leading-8 text-[#eaecf0]/70">

              Practice with AI-powered interview simulations,
              receive instant performance analytics, and improve
              your confidence before your real interview.

            </p>

            <Link to='/interviewsetup' className="mt-8 flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[#d90000] to-indigo-600 px-8 py-4 font-semibold text-white transition duration-300 hover:scale-105 hover:shadow-[0_0_35px_rgba(217,0,0,.35)]">

              <Rocket size={20} />

              Start Interview

            </Link>

          </div>

          <div className="hidden lg:flex">

            <div className="flex h-40 w-40 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-[#d90000]/20 to-indigo-600/20">

              <Rocket
                size={70}
                className="text-[#d90000]"
              />

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
            AI Generated Statistics
          </p>

        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">

          {stats.map((stat, index) => {

            const Icon = stat.icon;

            return (

              <div
                key={index}
                className="group rounded-3xl border border-white/10 bg-[#0d1538]/80 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-[#d90000]/40 hover:shadow-[0_0_35px_rgba(217,0,0,.25)]"
              >

                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${stat.color}`}
                >

                  <Icon
                    size={26}
                    className="text-white"
                  />

                </div>

                <p className="mt-6 text-sm text-[#eaecf0]/60">
                  {stat.label}
                </p>

                <h3 className="mt-2 text-3xl font-bold text-white">
                  {stat.value}
                </h3>

              </div>

            );

          })}

        </div>

      </div>

      {/* Bottom Card */}

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