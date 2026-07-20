// src/pages/AIFeedbackReport/TranscriptCritique.jsx

import React from "react";
import { MessageSquareText, User, Bot, Star } from "lucide-react";

export default function TranscriptCritique() {
  const dummyTranscripts = [
    {
      qNum: 1,
      question:
        "Explain the concept of closures in JavaScript and provide a practical real-world use case.",

      candidateAnswer:
        "Closures happen when an inner function retains access to variables from its outer enclosing scope even after the parent function has executed. A real-world example is maintaining private counters or creating factory functions.",

      score: 92,

      aiRemark:
        "Spot-on explanation. Covered lexical scoping and lifetime preservation accurately.",
    },

    {
      qNum: 2,
      question: "What is the difference between state and props in React?",

      candidateAnswer:
        "Props are read-only values passed down from parent to child components. State is local mutable data managed inside the component itself using hooks like useState.",

      score: 78,

      aiRemark:
        "Correct distinction. Mentioning unidirectional data flow and component re-render behavior would make this response stronger.",
    },
  ];

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
            Review each interview response alongside AI-generated observations
            and scoring.
          </p>
        </div>

        {/* Questions */}

        <div className="mt-8 space-y-8">
          {dummyTranscripts.map((item, idx) => (
            <div
              key={idx}
              className="rounded-3xl border border-white/10 bg-[#030712]/40 p-6 transition-all duration-300 hover:border-[#d90000]/30 hover:bg-white/5"
            >
              {/* Question Header */}

              <div className="flex flex-col gap-4 border-b border-white/10 pb-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#d90000] to-indigo-600">
                    <MessageSquareText className="text-white" size={22} />
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-[3px] text-[#d90000] font-semibold">
                      Question {item.qNum}
                    </p>

                    <h3 className="mt-2 text-lg font-semibold text-white">
                      {item.question}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#d90000] to-indigo-600 px-5 py-2 text-white">
                  <Star size={16} />

                  <span className="font-bold">{item.score}%</span>
                </div>
              </div>

              {/* Candidate Answer */}

              <div className="mt-6 rounded-2xl border border-white/10 bg-[#030712]/70 p-5">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/20">
                    <User className="text-indigo-400" size={18} />
                  </div>

                  <h4 className="font-semibold text-white">
                    Candidate Response
                  </h4>
                </div>

                <p className="leading-8 text-[#eaecf0]/70 italic">
                  "{item.candidateAnswer}"
                </p>
              </div>

              {/* AI Feedback */}

              <div className="mt-6 rounded-2xl border border-[#d90000]/20 bg-[#d90000]/10 p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d90000]/20">
                    <Bot className="text-[#ff6b6b]" size={18} />
                  </div>

                  <div>
                    <h4 className="font-semibold text-[#ff8a8a]">
                      AI Observation
                    </h4>

                    <p className="mt-3 leading-7 text-[#eaecf0]/70">
                      {item.aiRemark}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
