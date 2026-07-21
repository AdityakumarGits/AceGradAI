// src/pages/InterviewSetup/ConfigGuidelines.jsx

import React from "react";
import {
  BriefcaseBusiness,
  ClipboardList,
  Clock3,
  CheckCircle2,
} from "lucide-react";

export default function ConfigGuidelines({ selectedRole, setSelectedRole }) {
  const availableRoles = [
    "React Frontend Developer",
    "Node.js Backend Engineer",
    "Full Stack Software Engineer",
    "System Design & Architecture",
  ];

  const instructions = [
    "Ensure you are seated in a quiet room with minimal background noise.",
    "The AI interviewer will present 3–5 technical questions sequentially.",
    "Speak clearly and naturally. Your responses will be transcribed in real time.",
    "Avoid switching tabs or minimizing the interview window during the assessment.",
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0d1538]/80 p-8 backdrop-blur-xl">
      {/* Background Glow */}

      <div className="absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-indigo-500/20 blur-[140px]" />

      <div className="relative flex h-full flex-col justify-between">
        <div>
          {/* Header */}

          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#d90000] to-indigo-600">
              <BriefcaseBusiness className="text-white" size={26} />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white">
                Assessment Configuration
              </h2>

              <p className="mt-1 text-sm text-[#eaecf0]/60">
                Select your interview role and review the interview guidelines
                before starting.
              </p>
            </div>
          </div>

          {/* Role Selection */}

          <div className="mt-8">
            <label className="mb-3 block text-xs font-semibold uppercase tracking-[3px] text-[#d90000]">
              Target Role
            </label>

            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-[#030712]/70 px-5 py-4 text-white outline-none transition focus:border-[#d90000] focus:ring-2 focus:ring-[#d90000]/20"
            >
              {availableRoles.map((role, idx) => (
                <option key={idx} value={role} className="bg-[#0d1538]">
                  {role}
                </option>
              ))}
            </select>
          </div>

          {/* Instructions */}

          <div className="mt-8 rounded-3xl border border-white/10 bg-[#030712]/60 p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#d90000] to-indigo-600">
                <ClipboardList className="text-white" size={20} />
              </div>

              <div>
                <h3 className="font-semibold text-white">
                  Interview Guidelines
                </h3>

                <p className="text-sm text-[#eaecf0]/60">
                  Please read these instructions carefully.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {instructions.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-[#d90000]/30"
                >
                  <CheckCircle2
                    size={18}
                    className="mt-0.5 shrink-0 text-green-400"
                  />

                  <p className="text-sm leading-7 text-[#eaecf0]/70">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}

        <div className="mt-8 flex items-center justify-between rounded-2xl border border-white/10 bg-[#030712]/60 p-5">
          <div className="flex items-center gap-3">
            <Clock3 className="text-[#d90000]" size={22} />

            <span className="text-[#eaecf0]/70">Estimated Duration</span>
          </div>

          <span className="rounded-full bg-gradient-to-r from-[#d90000] to-indigo-600 px-5 py-2 font-semibold text-white">
            15–20 Minutes
          </span>
        </div>
      </div>
    </div>
  );
}
