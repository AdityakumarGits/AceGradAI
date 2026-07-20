// src/pages/StartInterview/TranscriptionPanel.jsx

import React from "react";
import {
  Mic,
  MicOff,
  ArrowRight,
  Send,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function TranscriptionPanel({
  transcribedText,
  setTranscribedText,
  isRecording,
  setIsRecording,
  onNext,
  isLastQuestion,
}) {

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);

      setTranscribedText(
        (prev) =>
          prev +
          (prev ? " " : "") +
          "[Simulated live speech engine picking up voice token matrices... Everything spoken shows instantly here.]"
      );
    } else {
      setIsRecording(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0d1538]/80 backdrop-blur-xl">

      {/* Background Glow */}

      <div className="absolute -top-16 right-0 h-60 w-60 rounded-full bg-indigo-500/20 blur-[120px]" />

      <div className="absolute bottom-0 -left-10 h-48 w-48 rounded-full bg-[#d90000]/20 blur-[120px]" />

      <div className="relative flex h-full flex-col p-8">

        {/* Header */}

        <div className="mb-6 flex items-center justify-between">

          <div>

            <p className="text-xs uppercase tracking-[3px] text-[#d90000] font-semibold">
              Live Transcript
            </p>

            <h3 className="mt-2 text-xl font-bold text-white">
              AI Speech Recognition
            </h3>

          </div>

          {isRecording && (
            <div className="flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2">

              <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />

              <span className="text-xs font-semibold uppercase tracking-wider text-red-400">
                Recording
              </span>

            </div>
          )}

        </div>

        {/* Textarea */}

        <textarea
          value={transcribedText}
          onChange={(e) => setTranscribedText(e.target.value)}
          placeholder="Start speaking or type your answer here. AceGrad AI will evaluate your communication, confidence, and technical accuracy."
          className="min-h-[340px] flex-1 rounded-2xl border border-white/10 bg-[#030712]/70 p-6 text-[#eaecf0] placeholder:text-[#eaecf0]/40 focus:border-[#d90000]/50 focus:outline-none focus:ring-2 focus:ring-[#d90000]/20 resize-none leading-8"
        />

        {/* Footer */}

        <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">

          {/* Recording Button */}

          <button
            onClick={toggleRecording}
            className={`flex items-center gap-3 rounded-2xl px-7 py-4 font-semibold transition-all duration-300 ${
              isRecording
                ? "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-[0_0_30px_rgba(220,38,38,.35)] animate-pulse"
                : "bg-gradient-to-r from-[#d90000] to-indigo-600 text-white hover:scale-105 hover:shadow-[0_0_35px_rgba(217,0,0,.35)]"
            }`}
          >

            {isRecording ? (
              <>
                <MicOff size={20} />
                Stop Recording
              </>
            ) : (
              <>
                <Mic size={20} />
                Start Recording
              </>
            )}

          </button>

          {/* Next Button */}

          <Link to='/feedback'
            onClick={onNext}
            disabled={!transcribedText.trim()}
            className={`flex items-center gap-3 rounded-2xl px-7 py-4 font-semibold transition-all duration-300 ${
              transcribedText.trim()
                ? "bg-gradient-to-r from-indigo-600 to-[#d90000] text-white hover:scale-105 hover:shadow-[0_0_35px_rgba(99,102,241,.35)]"
                : "cursor-not-allowed border border-white/10 bg-white/5 text-[#eaecf0]/30"
            }`}
          >

            {isLastQuestion ? (
              <>
                <Send size={20} />
                Submit Interview
              </>
            ) : (
              <>
                Next Question
                <ArrowRight size={20} />
              </>
            )}

          </Link>

        </div>

      </div>

    </div>
  );
}