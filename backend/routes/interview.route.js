import express from "express";

import { protect } from "../middlewares/protectedMiddleware.js";

import {
  startInterview,
  textToSpeech,
  submitAnswer,
  endInterview,
  getAllInterviews,
  getInterviewDetails,
  getInterviewReport,
  verifyInterviewOtp,
  submitGuestAnswer,
} from "../controller/Interview.controller.js";

import {
  startInterviewLimiter,
  submitAnswerLimiter,
  ttsLimiter,
  endInterviewLimiter,
  otpVerifyLimiter,
} from "../middlewares/rateLimiter.js";

import {
  resumeUpload,
  audioUpload,
} from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// Start interview
router.post(
  "/startInterview",
  protect,
  startInterviewLimiter,
  resumeUpload.single("resume"),
  startInterview
);

// Submit candidate answer
router.post(
  "/submitAnswer",
  protect,
  submitAnswerLimiter,
  audioUpload.single("audio"),
  submitAnswer
);

// Text to speech
router.post(
  "/textToSpeech",
  protect,
  ttsLimiter,
  textToSpeech
);

// Guest interview
router.post(
  "/verifyInterviewOtp",
  otpVerifyLimiter,
  verifyInterviewOtp
);

router.post(
  "/submitGuestAnswer",
  submitGuestAnswer
);

// End interview
router.post(
  "/endInterview",
  protect,
  endInterviewLimiter,
  endInterview
);

// Interview history
router.get(
  "/getAllInterviews",
  protect,
  getAllInterviews
);

router.get(
  "/getInterviewDetails/:interviewId",
  protect,
  getInterviewDetails
);

// Interview report
router.get(
  "/:interviewId/report",
  protect,
  getInterviewReport
);

export default router;