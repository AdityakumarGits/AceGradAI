// src/pages/InterviewSetup/InterviewSetup.jsx

import React, { useState } from "react";
import { Settings2, ArrowLeft, Rocket, CheckCircle2 } from "lucide-react";

import DeviceCheckPanel from "./DeviceCheckPanel";
import ConfigGuidelines from "./ConfigGuidelines";
import { Link } from "react-router-dom";

export default function InterviewSetup() {
  const [selectedRole, setSelectedRole] = useState("React Frontend Developer");

  const [micStatus, setMicStatus] = useState("ready");

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#030712] via-[#070f2b] to-[#0f172a] text-[#eaecf0]">
      {/* Background Glow */}

      <div className="absolute -top-40 -left-32 h-[420px] w-[420px] rounded-full bg-[#d90000]/15 blur-[180px]" />

      <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-indigo-600/15 blur-[220px]" />

      <div className="relative z-10 flex min-h-screen flex-col px-8 py-8">
        {/* Header */}

        <header className="mx-auto flex w-full max-w-6xl items-center justify-between rounded-3xl border border-white/10 bg-[#0d1538]/80 px-8 py-6 backdrop-blur-xl">
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#d90000] to-indigo-600 shadow-lg">
              <Settings2 className="text-white" size={30} />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-white">Interview Setup</h1>

              <p className="mt-2 text-[#eaecf0]/60">
                Configure your environment before entering the AI interview
                room.
              </p>
            </div>
          </div>

          <div className="rounded-full border border-[#d90000]/30 bg-[#d90000]/10 px-5 py-3">
            <span className="text-sm font-semibold text-[#d90000]">
              Step 1 / 2
            </span>
          </div>
        </header>

        {/* Main */}

        <main className="mx-auto my-8 grid w-full max-w-6xl flex-1 grid-cols-1 gap-8 lg:grid-cols-2">
          <DeviceCheckPanel micStatus={micStatus} setMicStatus={setMicStatus} />

          <ConfigGuidelines
            selectedRole={selectedRole}
            setSelectedRole={setSelectedRole}
          />
        </main>

        {/* Footer */}

        <footer className="mx-auto flex w-full max-w-6xl items-center justify-between rounded-3xl border border-white/10 bg-[#0d1538]/80 px-8 py-6 backdrop-blur-xl">
          <button className="flex items-center gap-3 text-[#eaecf0]/70 transition hover:text-white">
            <ArrowLeft size={20} />
            Return to Dashboard
          </button>

          <Link to='/startinterview'
            disabled={micStatus !== "ready"}
            className={`flex items-center gap-3 rounded-2xl px-8 py-4 font-semibold transition-all duration-300 ${
              micStatus === "ready"
                ? "bg-gradient-to-r from-[#d90000] to-indigo-600 text-white hover:scale-105 hover:shadow-[0_0_35px_rgba(217,0,0,.35)]"
                : "cursor-not-allowed border border-white/10 bg-white/5 text-[#eaecf0]/30"
            }`}
          >
            <CheckCircle2 size={20} />
            <Rocket size={18} />
            Enter Interview Room
          </Link>
        </footer>
      </div>
    </div>
  );
}
