import React from "react";
import {
  CalendarDays,
  FileText,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HistorySection({
  interviews = [],
  loading = false,
}) {
  const navigate = useNavigate();

  const getScore = (item) =>
    Number(
      item?.evaluation?.overallScore ??
        item?.overallScore ??
        item?.score ??
        0
    );

  const getRole = (item) =>
    item?.jobRole ||
    item?.position ||
    item?.targetPosition ||
    item?.role ||
    "AI Mock Interview";

  const getDate = (item) => {
    const date =
      item?.createdAt ||
      item?.completedAt ||
      item?.updatedAt;

    if (!date) return "Date unavailable";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getInterviewId = (item) =>
    item?._id || item?.id || item?.interviewId;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0d1538]/80 backdrop-blur-xl">
      <div className="absolute -left-16 -top-16 h-56 w-56 rounded-full bg-[#d90000]/20 blur-[120px]" />
      <div className="absolute -bottom-20 right-0 h-64 w-64 rounded-full bg-indigo-500/20 blur-[140px]" />

      <div className="relative">
        {/* Header */}
        <div className="border-b border-white/10 p-7">
          <h2 className="text-2xl font-bold text-white">
            Interview History
          </h2>

          <p className="mt-2 text-sm text-[#eaecf0]/60">
            View all your completed AI interview sessions and
            performance reports.
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2
              className="animate-spin text-[#d90000]"
              size={32}
            />
          </div>
        ) : interviews.length === 0 ? (
          <div className="p-12 text-center">
            <FileText
              size={45}
              className="mx-auto text-[#eaecf0]/30"
            />

            <h3 className="mt-5 text-lg font-semibold text-white">
              No interviews yet
            </h3>

            <p className="mt-2 text-sm text-[#eaecf0]/50">
              Complete your first AI mock interview to see your
              history here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px]">
              <thead>
                <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-[#eaecf0]/50">
                  <th className="px-8 py-5">Interview</th>
                  <th className="px-8 py-5">Date</th>
                  <th className="px-8 py-5">Score</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {interviews.map((item, index) => {
                  const score = getScore(item);
                  const interviewId = getInterviewId(item);

                  return (
                    <tr
                      key={interviewId || index}
                      className="border-b border-white/5 transition duration-300 hover:bg-white/5"
                    >
                      {/* Interview */}
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#d90000] to-indigo-600">
                            <FileText
                              className="text-white"
                              size={20}
                            />
                          </div>

                          <div>
                            <h4 className="font-semibold text-white">
                              {getRole(item)}
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
                          {getDate(item)}
                        </div>
                      </td>

                      {/* Score */}
                      <td className="px-8 py-6">
                        <span
                          className={`rounded-full border px-4 py-2 text-sm font-semibold ${
                            score >= 8.5
                              ? "border-green-500/30 bg-green-500/15 text-green-400"
                              : score >= 7
                              ? "border-indigo-500/30 bg-indigo-500/15 text-indigo-300"
                              : score >= 5
                              ? "border-yellow-500/30 bg-yellow-500/15 text-yellow-400"
                              : "border-[#d90000]/30 bg-[#d90000]/15 text-[#ff8a8a]"
                          }`}
                        >
                          {score}/10
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-8 py-6">
                        <span className="rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2 text-xs font-medium text-green-400">
                          {item?.status || "Completed"}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-8 py-6 text-right">
                        <button
                          disabled={!interviewId}
                          onClick={() =>
                            interviewId &&
                            navigate(
                              `/ai-feedback-report/${interviewId}`
                            )
                          }
                          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#d90000] to-indigo-600 px-5 py-2 text-sm font-medium text-white transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(217,0,0,.3)] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          View Report
                          <ArrowRight size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}