import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

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
  const { interviewId } = useParams();

  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        const response = await axios.get(
          `http://localhost:5000/api/v1/interview/${interviewId}/report`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("📊 Interview Report:", response.data);

        setInterview(response.data.data.interview);
      } catch (error) {
        console.error("❌ Fetch Report Error:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load interview report"
        );
      } finally {
        setLoading(false);
      }
    };

    if (interviewId) {
      fetchReport();
    }
  }, [interviewId]);

  // -----------------------------
  // Loading
  // -----------------------------

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#030712] text-white">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-[#d90000]" />

          <p className="mt-4 text-[#eaecf0]/60">
            Generating your AI interview report...
          </p>
        </div>
      </div>
    );
  }

  // -----------------------------
  // Error
  // -----------------------------

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#030712] px-6 text-white">
        <div className="rounded-3xl border border-red-500/20 bg-[#0d1538] p-8 text-center">
          <h2 className="text-2xl font-bold">
            Unable to load report
          </h2>

          <p className="mt-3 text-red-300">
            {error}
          </p>

          <Link
            to="/candidatedashboard"
            className="mt-6 inline-flex rounded-xl bg-gradient-to-r from-[#d90000] to-indigo-600 px-5 py-3 font-semibold"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!interview) {
    return null;
  }

  const evaluation = interview.evaluation;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#030712] via-[#070f2b] to-[#0f172a] text-[#eaecf0]">

      {/* Background Glow */}
      <div className="absolute -left-32 -top-40 h-96 w-96 rounded-full bg-[#d90000]/15 blur-[180px]" />

      <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-indigo-600/15 blur-[220px]" />

      <div className="relative z-10 space-y-8 p-8">

        {/* Header */}
        <header className="rounded-3xl border border-white/10 bg-[#0d1538]/80 p-8 backdrop-blur-xl">

          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            {/* Left */}
            <div>

              <div className="flex items-center gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#d90000] to-indigo-600 shadow-lg">
                  <FileBarChart
                    className="text-white"
                    size={28}
                  />
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
                  <User
                    size={16}
                    className="text-[#d90000]"
                  />

                  <span>
                    Candidate
                  </span>
                </div>

                {interview.jobTitle && (
                  <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                    <Briefcase
                      size={16}
                      className="text-indigo-400"
                    />

                    <span>
                      {interview.jobTitle}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                  <CalendarDays
                    size={16}
                    className="text-[#d90000]"
                  />

                  <span>
                    {new Date(
                      interview.createdAt
                    ).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>

              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">

              <button
                type="button"
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-white transition-all hover:bg-white/10"
              >
                <Download size={18} />
                Download PDF
              </button>

              <Link
                to="/candidatedashboard"
                className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[#d90000] to-indigo-600 px-6 py-4 font-semibold text-white transition-all duration-300 hover:scale-105"
              >
                <LayoutDashboard size={18} />
                Back to Dashboard
              </Link>

            </div>

          </div>
        </header>

        {/* Overview */}
        <ReportOverview
          evaluation={evaluation}
        />

        {/* Middle */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

          <div className="lg:col-span-2">
            <SkillBreakdown
              evaluation={evaluation}
            />
          </div>

          <div>
            <ActionPlan
              evaluation={evaluation}
            />
          </div>

        </div>

        {/* Transcript */}
        <TranscriptCritique
          answers={interview.answers}
          questionWiseEvaluation={
            evaluation?.questionWiseEvaluation || []
          }
        />

      </div>
    </div>
  );
}