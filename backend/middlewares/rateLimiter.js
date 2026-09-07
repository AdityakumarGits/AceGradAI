import rateLimit from "express-rate-limit";

/**
 * Common factory — har-limiter isi-se-banega, taaki config-consistent rahe.
 * keyGenerator: agar authenticated-user hai to uski ID se-limit, warna IP se
 * (public/guest-routes ke liye fallback).
 */
const createLimiter = ({ windowMs, max, message }) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true, // RateLimit-* headers response me
    legacyHeaders: false,
    keyGenerator: (req) => req.user?.id || req.ip,
    message: {
      status: "fail",
      message: message || "Too many requests. Please try again later.",
    },
  });

// --------------------------------------------------
// startInterview — sabse-expensive (Gemini-call), tight-limit
// --------------------------------------------------
export const startInterviewLimiter = createLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message:
    "You can start up to 5 interviews per hour. Please try again later.",
});

// --------------------------------------------------
// submitAnswer — per-interview naturally ~5 baar hota hai, generous-rakho
// --------------------------------------------------
export const submitAnswerLimiter = createLimiter({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 30,
  message: "Too many answer submissions. Please slow down.",
});

// --------------------------------------------------
// textToSpeech — per-interview ~6 baar (welcome + 5 questions), generous
// --------------------------------------------------
export const ttsLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 40,
  message: "Too many speech requests. Please slow down.",
});

// --------------------------------------------------
// endInterview — sirf 1 baar per-interview, tight-limit theek hai
// --------------------------------------------------
export const endInterviewLimiter = createLimiter({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: "Too many evaluation requests. Please try again later.",
});

// --------------------------------------------------
// verifyInterviewOtp — PUBLIC route, brute-force-OTP-guess se bachne ke liye
// --------------------------------------------------
export const otpVerifyLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many OTP attempts. Please try again later.",
});