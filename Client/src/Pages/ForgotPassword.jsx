import React, { useState } from "react";

import {
  LockKeyhole,
  Mail,
  ShieldCheck,
  Lock,
  Eye,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

import { candidateToast } from "../utils/toast";
import API from "../services/api";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  // Send OTP
  const handleSendOtp = async (e) => {
  e?.preventDefault();

  if (!email.trim()) {
    candidateToast.error("Please enter your email address");
    return;
  }

  try {
    setOtpLoading(true);

    const otpResponse = await API.post("auth/forget-password", {
      email: email.trim(),
    });

    candidateToast.success("OTP sent to your email");

    console.log("OTP Response:", otpResponse.data);
  } catch (error) {
    console.error("Send OTP Error:", error);

    candidateToast.error(
      error.response?.data?.message || "Failed to send OTP"
    );
  } finally {
    setOtpLoading(false);
  }
};

  // Reset Password
 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!email.trim() || !password || !otp || !confirmPassword) {
    candidateToast.error("All fields are required");
    return;
  }

  if (otp.length !== 6) {
    candidateToast.error("Please enter a valid 6-digit OTP");
    return;
  }

  if (password.length < 8) {
    candidateToast.error("Password must be at least 8 characters");
    return;
  }

  if (password !== confirmPassword) {
    candidateToast.error("Passwords do not match");
    return;
  }

  try {
    setResetLoading(true);

    const response = await API.post("auth/reset-password", {
      email: email.trim(),
      otp,
      password,
    });

    console.log("Reset Password Response:", response.data);

    candidateToast.success("Password updated successfully");

    navigate("/candidatelogin");
  } catch (error) {
    console.error("Reset Password Error:", error);

    candidateToast.error(
      error.response?.data?.message || "Failed to reset password"
    );
  } finally {
    setResetLoading(false);
  }
};

  return (
    <div className="relative h-screen overflow-hidden bg-gradient-to-br from-[#030712] via-[#070f2b] to-[#0f172a] flex items-center justify-center px-4 py-10">

      {/* Background Glow */}
      <div className="absolute -top-40 -left-32 h-[380px] w-[380px] rounded-full bg-[#d90000]/20 blur-[170px]" />
      <div className="absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-indigo-600/20 blur-[220px]" />
      <div className="relative w-full max-w-lg">

        {/* Card */}
        <div className="rounded-3xl border border-white/10 bg-[#0d1538]/80 backdrop-blur-xl p-8 shadow-2xl">

          {/* Icon */}
          <div className="flex justify-center">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#d90000] to-indigo-600 flex items-center justify-center shadow-lg">
              <LockKeyhole
                size={25}
                className="text-white"
              />
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mt-3">
            <h1 className="text-3xl font-bold text-white">
              Forgot Password
            </h1>

            <p className="mt-2 text-[#eaecf0]/60">
              Reset your password securely by verifying your email.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="mt-5 space-y-4"
          >

            {/* Email */}
            <div>
              <label className="text-sm text-[#eaecf0]/80 mb-2 block">
                Email Address
              </label>

              <div className="flex items-center rounded-2xl border border-white/10 bg-[#030712]/60 px-4">
                <Mail
                  size={18}
                  className="text-[#d90000]"
                />

                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your registered email"
                  className="w-full bg-transparent px-3 py-3 outline-none text-white placeholder:text-[#eaecf0]/40"
                />
              </div>
            </div>

            {/* OTP */}
            <div>
              <label className="text-sm text-[#eaecf0]/80 mb-2 block">
                OTP Verification
              </label>

              <div className="flex gap-3">

                <div className="flex flex-1 items-center rounded-2xl border border-white/10 bg-[#030712]/60 px-3">
                  <ShieldCheck
                    size={18}
                    className="text-[#d90000]"
                  />

                  <input
                    required
                    type="text"
                    maxLength={6}
                    inputMode="numeric"
                    value={otp}
                    onChange={(e) =>
                      setOtp(
                        e.target.value.replace(/\D/g, "")
                      )
                    }
                    placeholder="Enter OTP"
                    className="w-full bg-transparent px-3 py-3 outline-none text-white placeholder:text-[#eaecf0]/40"
                  />
                </div>

                <button
                  type="button"
                  disabled={otpLoading || !email.trim()}
                  onClick={handleSendOtp}
                  className="rounded-2xl bg-gradient-to-r from-[#d90000] to-indigo-600 px-5 font-semibold text-white transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {otpLoading
                    ? "Sending OTP..."
                    : "Send OTP"}
                </button>

              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="text-sm text-[#eaecf0]/80 mb-2 block">
                New Password
              </label>

              <div className="flex items-center rounded-2xl border border-white/10 bg-[#030712]/60 px-3">

                <Lock
                  size={18}
                  className="text-[#d90000]"
                />

                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Enter new password"
                  className="w-full bg-transparent px-3 py-3 outline-none text-white placeholder:text-[#eaecf0]/40"
                />

                <Eye
                  size={18}
                  className="text-[#eaecf0]/40"
                />

              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-sm text-[#eaecf0]/80 mb-2 block">
                Confirm Password
              </label>

              <div className="flex items-center rounded-2xl border border-white/10 bg-[#030712]/60 px-3">

                <Lock
                  size={18}
                  className="text-[#d90000]"
                />

                <input
                  required
                  type="password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  placeholder="Confirm password"
                  className="w-full bg-transparent px-3 py-3 outline-none text-white placeholder:text-[#eaecf0]/40"
                />

                <Eye
                  size={18}
                  className="text-[#eaecf0]/40"
                />

              </div>
            </div>

            {/* Reset Button */}
            <button
              type="submit"
              disabled={resetLoading}
              className="mt-6 w-full rounded-2xl bg-gradient-to-r from-[#d90000] to-indigo-600 py-4 text-lg font-semibold text-white transition-all hover:scale-[1.02] hover:shadow-[0_0_35px_rgba(217,0,0,.35)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {resetLoading
                ? "Updating..."
                : "Reset Password"}

              {!resetLoading && (
                <ArrowRight size={20} />
              )}
            </button>

          </form>

          {/* Back */}
          <Link
            to="/candidatelogin"
            className="mt-4 flex w-full items-center justify-center gap-1 text-[#eaecf0]/60 transition hover:text-white"
          >
            <ArrowLeft size={18} />
            Back to Login
          </Link>

        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;