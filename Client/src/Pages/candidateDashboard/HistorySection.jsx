// src/pages/CandidateDashboard/HistorySection.jsx

import React from "react";
import { CalendarDays, FileText, ArrowRight } from "lucide-react";

export default function HistorySection() {
  const dummyHistory = [
    {
      role: "Frontend Engineer (React)",
      date: "July 15, 2026",
      score: 82,
      status: "Completed",
    },
    {
      role: "Node.js Backend Developer",
      date: "July 10, 2026",
      score: 74,
      status: "Completed",
    },
    {
      role: "Full Stack Engineer Mock",
      date: "July 04, 2026",
      score: 79,
      status: "Completed",
    },
    {
      role: "Java Developer",
      date: "June 28, 2026",
      score: 91,
      status: "Completed",
    },
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0d1538]/80 backdrop-blur-xl">

      {/* Glow */}

      <div className="absolute -top-16 -left-16 h-56 w-56 rounded-full bg-[#d90000]/20 blur-[120px]" />

      <div className="absolute -bottom-20 right-0 h-64 w-64 rounded-full bg-indigo-500/20 blur-[140px]" />

      <div className="relative">

        {/* Header */}

        <div className="border-b border-white/10 p-7">

          <h2 className="text-2xl font-bold text-white">
            Interview History
          </h2>

          <p className="mt-2 text-sm text-[#eaecf0]/60">
            View all your completed AI interview sessions and performance
            reports.
          </p>

        </div>

        {/* Table */}

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-[#eaecf0]/50">

                <th className="px-8 py-5">
                  Interview
                </th>

                <th className="px-8 py-5">
                  Date
                </th>

                <th className="px-8 py-5">
                  Score
                </th>

                <th className="px-8 py-5">
                  Status
                </th>

                <th className="px-8 py-5 text-right">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {dummyHistory.map((item, index) => (

                <tr
                  key={index}
                  className="border-b border-white/5 transition duration-300 hover:bg-white/5"
                >

                  {/* Interview */}

                  <td className="px-8 py-6">

                    <div className="flex items-center gap-4">

                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#d90000] to-indigo-600">

                        <FileText className="text-white" size={20} />

                      </div>

                      <div>

                        <h4 className="font-semibold text-white">
                          {item.role}
                        </h4>

                        <p className="mt-1 text-xs text-[#eaecf0]/50">
                          AI Mock Interview
                        </p>

                      </div>

                    </div>

                  </td>

                  {/* Date */}

                  <td className="px-8 py-6">

                    <div className="flex items-center gap-2 text-[#eaecf0]/70">

                      <CalendarDays size={16} />

                      {item.date}

                    </div>

                  </td>

                  {/* Score */}

                  <td className="px-8 py-6">

                    <span
                      className={`rounded-full px-4 py-2 text-sm font-semibold ${
                        item.score >= 85
                          ? "bg-green-500/15 text-green-400 border border-green-500/30"
                          : item.score >= 75
                          ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/30"
                          : "bg-[#d90000]/15 text-[#ff8a8a] border border-[#d90000]/30"
                      }`}
                    >
                      {item.score}%
                    </span>

                  </td>

                  {/* Status */}

                  <td className="px-8 py-6">

                    <span className="rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2 text-xs font-medium text-green-400">

                      {item.status}

                    </span>

                  </td>

                  {/* Action */}

                  <td className="px-8 py-6 text-right">

                    <button className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#d90000] to-indigo-600 px-5 py-2 text-sm font-medium text-white transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(217,0,0,.3)]">

                      View Report

                      <ArrowRight size={16} />

                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}