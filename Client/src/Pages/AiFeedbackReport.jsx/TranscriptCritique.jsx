import React from "react";
import {
  MessageSquareText,
  User,
  Bot,
  Star,
} from "lucide-react";

export default function TranscriptCritique({
  answers = [],
  questionWiseEvaluation = [],
}) {
  const transcripts = answers.map((answer, index) => {
    const evaluation = questionWiseEvaluation.find(
      (item) => item.questionIndex === answer.questionIndex
    );

    return {
      qNum: answer.questionIndex + 1,
      question: answer.questionText,
      candidateAnswer: answer.userAnswer,
      score: evaluation?.score ?? 0,
      whatWasGood: evaluation?.whatWasGood ?? "",
      whatCouldImprove: evaluation?.whatCouldImprove ?? "",
      feedback: evaluation?.feedback ?? "",
    };
  });

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0d1538]/80 backdrop-blur-xl">

      {/* Background Glow */}
      <div className="absolute -top-20 -left-20 h-60 w-60 rounded-full bg-[#d90000]/20 blur-[120px]" />

      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-indigo-500/20 blur-[150px]" />

      <div className="relative p-8">

        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-white">
            Transcript & AI Review
          </h2>

          <p className="mt-2 text-[#eaecf0]/60">
            Review each interview response alongside AI-generated
            evaluation and feedback.
          </p>
        </div>

        {/* Questions */}
        <div className="mt-8 space-y-8">

          {transcripts.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-[#030712]/40 p-8 text-center">
              <p className="text-[#eaecf0]/50">
                No interview responses available.
              </p>
            </div>
          ) : (
            transcripts.map((item, idx) => (

              <div
                key={idx}
                className="rounded-3xl border border-white/10 bg-[#030712]/40 p-6 transition-all duration-300 hover:border-[#d90000]/30 hover:bg-white/5"
              >

                {/* Question Header */}
                <div className="flex flex-col gap-4 border-b border-white/10 pb-5 lg:flex-row lg:items-center lg:justify-between">

                  <div className="flex items-start gap-4">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#d90000] to-indigo-600">
                      <MessageSquareText
                        className="text-white"
                        size={22}
                      />
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[3px] text-[#d90000]">
                        Question {item.qNum}
                      </p>

                      <h3 className="mt-2 text-lg font-semibold text-white">
                        {item.question}
                      </h3>
                    </div>

                  </div>

                  {/* Score */}
                  <div className="flex shrink-0 items-center gap-2 self-start rounded-full bg-gradient-to-r from-[#d90000] to-indigo-600 px-5 py-2 text-white lg:self-auto">
                    <Star size={16} />
                    <span className="font-bold">
                      {item.score}/10
                    </span>
                  </div>

                </div>

                {/* Candidate Answer */}
                <div className="mt-6 rounded-2xl border border-white/10 bg-[#030712]/70 p-5">

                  <div className="mb-4 flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/20">
                      <User
                        className="text-indigo-400"
                        size={18}
                      />
                    </div>

                    <h4 className="font-semibold text-white">
                      Candidate Response
                    </h4>

                  </div>

                  <p className="leading-8 text-[#eaecf0]/70">
                    {item.candidateAnswer || "No response available."}
                  </p>

                </div>

                {/* AI Feedback */}
                <div className="mt-6 rounded-2xl border border-[#d90000]/20 bg-[#d90000]/10 p-5">

                  <div className="flex items-start gap-4">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#d90000]/20">
                      <Bot
                        className="text-[#ff6b6b]"
                        size={18}
                      />
                    </div>

                    <div className="w-full">

                      <h4 className="font-semibold text-[#ff8a8a]">
                        AI Evaluation
                      </h4>

                      {/* What Was Good */}
                      {item.whatWasGood && (
                        <div className="mt-4">
                          <p className="text-sm font-semibold text-green-400">
                            What Was Good
                          </p>

                          <p className="mt-2 leading-7 text-[#eaecf0]/70">
                            {item.whatWasGood}
                          </p>
                        </div>
                      )}

                      {/* What Could Improve */}
                      {item.whatCouldImprove && (
                        <div className="mt-4">
                          <p className="text-sm font-semibold text-yellow-400">
                            What Could Improve
                          </p>

                          <p className="mt-2 leading-7 text-[#eaecf0]/70">
                            {item.whatCouldImprove}
                          </p>
                        </div>
                      )}

                      {/* General Feedback */}
                      {item.feedback && (
                        <div className="mt-4 border-t border-white/10 pt-4">
                          <p className="text-sm font-semibold text-indigo-300">
                            AI Feedback
                          </p>

                          <p className="mt-2 leading-7 text-[#eaecf0]/70">
                            {item.feedback}
                          </p>
                        </div>
                      )}

                    </div>

                  </div>

                </div>

              </div>

            ))
          )}

        </div>
      </div>
    </div>
  );
}