// src/pages/InterviewSetup/DeviceCheckPanel.jsx

import React from "react";
import { Mic, Wifi, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function DeviceCheckPanel({ micStatus, setMicStatus }) {
  const handleMicTest = () => {
    setMicStatus("testing");

    setTimeout(() => {
      setMicStatus("ready");
    }, 2000);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0d1538]/80 p-8 backdrop-blur-xl">
      {/* Glow */}

      <div className="absolute -top-20 -left-20 h-56 w-56 rounded-full bg-[#d90000]/15 blur-[120px]" />

      <div className="relative flex h-full flex-col justify-between">
        {/* Header */}

        <div>
          <h2 className="text-2xl font-bold text-white">Device Verification</h2>

          <p className="mt-2 text-sm text-[#eaecf0]/60">
            Verify your microphone and system before joining the AI interview
            session.
          </p>

          {/* Mic Card */}

          <div className="mt-8 rounded-3xl border border-white/10 bg-[#030712]/60 p-8 text-center">
            {/* Mic Icon */}

            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#d90000] to-indigo-600 shadow-lg">
              <Mic size={38} className="text-white" />
            </div>

            {/* Status */}

            <div className="mt-6">
              <p className="text-lg font-semibold text-white">
                {micStatus === "idle" && "Click below to test your microphone"}

                {micStatus === "testing" && "Listening... Please speak now"}

                {micStatus === "ready" && "Microphone verified successfully"}
              </p>

              <p className="mt-2 text-sm text-[#eaecf0]/60">
                {micStatus === "ready"
                  ? "You're ready to begin."
                  : "A quick test ensures the best interview experience."}
              </p>
            </div>

            {/* Audio Bars */}

            <div className="mt-8 flex h-14 items-end justify-center gap-2">
              {[35, 70, 45, 90, 60, 30, 80, 55, 100, 45].map(
                (height, index) => (
                  <div
                    key={index}
                    className={`w-2 rounded-full transition-all duration-300 ${
                      micStatus === "testing"
                        ? "animate-pulse bg-gradient-to-t from-[#d90000] to-indigo-500"
                        : micStatus === "ready"
                          ? "bg-green-500"
                          : "bg-white/10"
                    }`}
                    style={{
                      height: micStatus === "idle" ? "20%" : `${height}%`,
                    }}
                  />
                ),
              )}
            </div>

            {/* Button */}

            <button
              onClick={handleMicTest}
              disabled={micStatus === "testing"}
              className={`mt-8 rounded-2xl px-6 py-3 font-semibold transition-all duration-300 ${
                micStatus === "testing"
                  ? "cursor-not-allowed border border-white/10 bg-white/5 text-[#eaecf0]/40"
                  : "bg-gradient-to-r from-[#d90000] to-indigo-600 text-white hover:scale-105 hover:shadow-[0_0_30px_rgba(217,0,0,.35)]"
              }`}
            >
              {micStatus === "testing" ? "Calibrating..." : "Test Microphone"}
            </button>
          </div>
        </div>

        {/* Status Cards */}

        <div className="mt-8 grid gap-4">
          <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#030712]/50 p-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-green-400" size={22} />

              <span className="text-[#eaecf0]/70">Browser Permissions</span>
            </div>

            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle2 size={18} />
              Granted
            </div>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#030712]/50 p-4">
            <div className="flex items-center gap-3">
              <Wifi className="text-indigo-400" size={22} />

              <span className="text-[#eaecf0]/70">Connection Latency</span>
            </div>

            <span className="font-semibold text-green-400">
              24 ms (Optimal)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
