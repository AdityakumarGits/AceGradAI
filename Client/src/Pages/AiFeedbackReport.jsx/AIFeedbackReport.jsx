// src/Pages/AiFeedbackReport.jsx/AIFeedbackReport.jsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import API from "../../services/api";
import { candidateToast } from "../../utils/toast";

import ReportOverview from "./ReportOverview";
import SkillBreakdown from "./SkillBreakdown";
import TranscriptCritique from "./TranscriptCritique";
import ActionPlan from "./ActionPlan";

export default function AIFeedbackReport() {
  const { interviewId } = useParams();
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchInterviewReport = async () => {
    try {
      setLoading(true);

      /*
       * IMPORTANT:
       * Is endpoint ko apne actual backend endpoint
       * ke according match karna.
       */

      const response = await API.get(`/interview/getInterview/${interviewId}`);

      const data =
        response?.data?.data?.interview ||
        response?.data?.data ||
        response?.data?.interview ||
        response?.data;

      setInterview(data);
    } catch (error) {
      console.error("Failed to fetch interview report:", error);

      candidateToast.error(
        error?.response?.data?.message || "Unable to load interview report",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (interviewId) {
      fetchInterviewReport();
    }
  }, [interviewId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#030712] via-[#070f2b] to-[#0f172a]">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-white/10 border-t-[#d90000]" />

          <p className="mt-5 text-sm text-[#eaecf0]/60">
            Generating your AI report...
          </p>
        </div>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#030712] px-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">
            Interview Report Not Found
          </h2>

          <p className="mt-3 text-[#eaecf0]/60">
            We couldn't find the requested interview report.
          </p>

          <button
            type="button"
            onClick={() => navigate("/candidatedashboard")}
            className="mt-6 rounded-xl bg-gradient-to-r from-[#d90000] to-indigo-600 px-6 py-3 font-semibold text-white"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  /*
   * Support both:
   *
   * interview.evaluation
   *
   * and
   *
   * interview itself containing evaluation fields
   */

  const evaluation = interview?.evaluation || interview;

  const answers = interview?.answers || interview?.responses || [];

  const questionWiseEvaluation =
    interview?.questionWiseEvaluation ||
    interview?.evaluation?.questionWiseEvaluation ||
    [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#030712] via-[#070f2b] to-[#0f172a] px-6 py-8 text-[#eaecf0] lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}

        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <button
              type="button"
              onClick={() => navigate("/candidatedashboard")}
              className="mb-4 flex items-center gap-2 text-sm text-[#eaecf0]/60 transition hover:text-white"
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </button>

            <p className="text-xs font-semibold uppercase tracking-[3px] text-[#d90000]">
              AI Interview Report
            </p>

            <h1 className="mt-2 text-4xl font-black text-white">
              Interview Performance
            </h1>

            <p className="mt-2 text-[#eaecf0]/60">
              Detailed AI analysis of your interview performance.
            </p>
          </div>
        </div>

        {/* Overall */}

        <div className="mb-6">
          <ReportOverview evaluation={evaluation} />
        </div>

        {/* Skill Breakdown */}

        <div className="mb-6">
          <SkillBreakdown evaluation={evaluation} />
        </div>

        {/* Transcript */}

        <div className="mb-6">
          <TranscriptCritique
            answers={answers}
            questionWiseEvaluation={questionWiseEvaluation}
          />
        </div>

        {/* Action Plan */}

        <ActionPlan evaluation={evaluation} />
      </div>
    </div>
  );
}
