import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Loader2,
  FileText,
} from "lucide-react";

import API from "../../services/api";
import { candidateToast } from "../../utils/toast";

import ReportOverview from "./ReportOverview";
import SkillBreakdown from "./SkillBreakdown";
import TranscriptCritique from "./TranscriptCritique";
import ActionPlan from "./ActionPlan";

export default function AIFeedbackReport() {
  const { interviewId } = useParams();
  const navigate = useNavigate();

  const [evaluation, setEvaluation] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [questionWiseEvaluation, setQuestionWiseEvaluation] =
    useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReport = async () => {
    try {
      setLoading(true);

      /*
       * IMPORTANT:
       * Yahan apne backend ke actual report endpoint ka
       * path use karna.
       */
      const response = await API.get(
        `/interview/getInterviewReport/${interviewId}`
      );

      const data = response?.data?.data || response?.data || {};

      setEvaluation(data?.evaluation || data);
      setAnswers(
        data?.answers ||
          data?.interview?.answers ||
          []
      );

      setQuestionWiseEvaluation(
        data?.questionWiseEvaluation ||
          data?.evaluation?.questionWiseEvaluation ||
          []
      );
    } catch (error) {
      console.error("Report fetch error:", error);

      candidateToast.error(
        "Unable to load interview report"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (interviewId) {
      fetchReport();
    }
  }, [interviewId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#030712] via-[#070f2b] to-[#0f172a]">
        <div className="flex flex-col items-center gap-4">
          <Loader2
            size={40}
            className="animate-spin text-[#d90000]"
          />

          <p className="text-sm text-[#eaecf0]/60">
            Generating interview report...
          </p>
        </div>
      </div>
    );
  }

  if (!evaluation) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#030712] via-[#070f2b] to-[#0f172a] px-6">
        <div className="text-center">
          <FileText
            size={50}
            className="mx-auto text-[#eaecf0]/30"
          />

          <h2 className="mt-5 text-2xl font-bold text-white">
            Report Not Found
          </h2>

          <p className="mt-2 text-[#eaecf0]/50">
            We could not find the evaluation for this interview.
          </p>

          <button
            onClick={() => navigate("/candidate-dashboard")}
            className="mt-6 rounded-xl bg-gradient-to-r from-[#d90000] to-indigo-600 px-6 py-3 font-semibold text-white"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#030712] via-[#070f2b] to-[#0f172a] px-6 py-8 text-[#eaecf0] lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <button
              onClick={() => navigate("/candidate-dashboard")}
              className="mb-5 flex items-center gap-2 text-sm text-[#eaecf0]/60 transition hover:text-white"
            >
              <ArrowLeft size={17} />
              Back to Dashboard
            </button>

            <h1 className="text-4xl font-bold text-white">
              AI Interview Report
            </h1>

            <p className="mt-2 text-[#eaecf0]/60">
              Detailed AI analysis of your interview performance.
            </p>
          </div>

          <div className="rounded-2xl border border-[#d90000]/20 bg-[#d90000]/10 px-5 py-3">
            <p className="text-xs uppercase tracking-wider text-[#eaecf0]/50">
              Interview ID
            </p>

            <p className="mt-1 max-w-[220px] truncate text-sm font-semibold text-[#ff8a8a]">
              {interviewId}
            </p>
          </div>
        </div>

        {/* Overall */}
        <ReportOverview evaluation={evaluation} />

        {/* Skill Breakdown */}
        <div className="mt-8">
          <SkillBreakdown evaluation={evaluation} />
        </div>

        {/* Transcript */}
        <div className="mt-8">
          <TranscriptCritique
            answers={answers}
            questionWiseEvaluation={
              questionWiseEvaluation
            }
          />
        </div>

        {/* Action Plan */}
        <div className="mt-8">
          <ActionPlan evaluation={evaluation} />
        </div>
      </div>
    </div>
  );
}