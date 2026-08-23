import Interview from "../model/interview.model.js";
import AppError from "../utils/appError.js";

import * as sdk from "microsoft-cognitiveservices-speech-sdk";

import {
  generateInterviewQuestions,
  evaluateInterviewSession,
  generateResumeInterviewQuestions,
  generateTopicInterviewQuestions,
} from "../services/gemini.service.js";

import axios from "axios";
import { PDFParse } from "pdf-parse";
import { DeepgramClient } from "@deepgram/sdk";

// --------------------------------------------------
// Deepgram Client
// --------------------------------------------------

const deepgram = new DeepgramClient({
  apiKey: process.env.DEEPGRAM_API_KEY,
});

// ==================================================
// START INTERVIEW
// ==================================================

/**
 * @route   POST /api/v1/interview/startInterview
 * @desc    Creates a new interview session.
 * @access  Protected
 */
export const startInterview = async (req, res, next) => {
  try {
    const {
      questionsSources,
      topics,
      jobTitle,
      jobDescription,
      experienceLevel,
      interviewType,
      candidateName,
      candidateEmail,
    } = req.body;

    // --------------------------------------------------
    // 1. Common Validation
    // --------------------------------------------------

    if (!questionsSources) {
      return next(
        new AppError("Question source is required", 400)
      );
    }

    if (!["jd", "topics", "resume"].includes(questionsSources)) {
      return next(
        new AppError(
          "Invalid question source. Use jd, topics, or resume",
          400
        )
      );
    }

    if (!experienceLevel) {
      return next(
        new AppError("Experience level is required", 400)
      );
    }

    if (
      !["fresher", "junior", "mid", "senior"].includes(
        experienceLevel
      )
    ) {
      return next(
        new AppError(
          "Invalid experience level",
          400
        )
      );
    }

    // --------------------------------------------------
    // 2. Interview Type Validation
    // --------------------------------------------------

    const finalInterviewType =
      interviewType || "practice";

    if (!["practice", "campaign"].includes(finalInterviewType)) {
      return next(
        new AppError(
          "Invalid interview type. Use practice or campaign",
          400
        )
      );
    }

    // Campaign-specific validation
    if (finalInterviewType === "campaign") {
      if (!candidateName?.trim()) {
        return next(
          new AppError(
            "Candidate name is required for campaign interview",
            400
          )
        );
      }

      if (!candidateEmail?.trim()) {
        return next(
          new AppError(
            "Candidate email is required for campaign interview",
            400
          )
        );
      }
    }

    // --------------------------------------------------
    // 3. Source Specific Validation
    // --------------------------------------------------

    // JD
    if (questionsSources === "jd") {
      if (!jobTitle?.trim() || !jobDescription?.trim()) {
        return next(
          new AppError(
            "Job Title and Job Description are required",
            400
          )
        );
      }
    }

    // Topics
    if (questionsSources === "topics") {
      if (
        !Array.isArray(topics) ||
        topics.length === 0
      ) {
        return next(
          new AppError(
            "At least one topic is required",
            400
          )
        );
      }
    }

    // Resume
    if (questionsSources === "resume") {
      if (!req.file) {
        return next(
          new AppError(
            "Resume file is required",
            400
          )
        );
      }

      if (req.file.mimetype !== "application/pdf") {
        return next(
          new AppError(
            "Only PDF resume is supported",
            400
          )
        );
      }
    }

    // --------------------------------------------------
    // 4. Logged-in User
    // --------------------------------------------------

    const userId = req.user.id;

    // --------------------------------------------------
    // 5. Generate AI Questions
    // --------------------------------------------------

    let aiQuestions;

    // JD
    if (questionsSources === "jd") {
      aiQuestions = await generateInterviewQuestions(
        jobTitle.trim(),
        jobDescription.trim(),
        experienceLevel
      );
    }

    // Topics
    else if (questionsSources === "topics") {
      aiQuestions =
        await generateTopicInterviewQuestions(
          topics,
          experienceLevel
        );
    }

    // Resume
    else if (questionsSources === "resume") {
      let parser;

      try {
        parser = new PDFParse({
          data: req.file.buffer,
        });

        const result = await parser.getText();

        const resumeText =
          result?.text?.trim();

        if (!resumeText) {
          return next(
            new AppError(
              "Could not extract text from resume PDF",
              400
            )
          );
        }

        aiQuestions =
          await generateResumeInterviewQuestions(
            resumeText,
            experienceLevel
          );
      } finally {
        if (parser) {
          await parser.destroy();
        }
      }
    }

    // --------------------------------------------------
    // 6. Validate Gemini Questions
    // --------------------------------------------------

    if (
      !Array.isArray(aiQuestions) ||
      aiQuestions.length === 0
    ) {
      return next(
        new AppError(
          "AI failed to generate interview questions",
          500
        )
      );
    }

    // --------------------------------------------------
    // 7. Campaign OTP
    // --------------------------------------------------

    let generatedOtp = null;

    if (finalInterviewType === "campaign") {
      generatedOtp = Math.floor(
        100000 + Math.random() * 900000
      ).toString();
    }

    // --------------------------------------------------
    // 8. Create Interview
    // --------------------------------------------------

    const newInterview =
      await Interview.create({
        userId,

        questionsSources,

        jobTitle:
          questionsSources === "jd"
            ? jobTitle.trim()
            : undefined,

        jobDescription:
          questionsSources === "jd"
            ? jobDescription.trim()
            : undefined,

        topics:
          questionsSources === "topics"
            ? topics
            : [],

        experienceLevel,

        questions: aiQuestions,

        interviewType: finalInterviewType,

        candidateName:
          finalInterviewType === "campaign"
            ? candidateName.trim()
            : undefined,

        candidateEmail:
          finalInterviewType === "campaign"
            ? candidateEmail.trim().toLowerCase()
            : undefined,

        accessOtp: generatedOtp,

        status: "pending",
      });

    // --------------------------------------------------
    // 9. Response
    // --------------------------------------------------

    return res.status(201).json({
      status: "success",
      message:
        "Interview session created successfully",

      data: {
        interview: newInterview,
        accessOtp: generatedOtp,
      },
    });

  } catch (error) {
    console.error(
      "❌ Start Interview Error:",
      error
    );

    return next(error);
  }
};

// ==================================================
// VERIFY CAMPAIGN OTP
// ==================================================

export const verifyInterviewOtp = async (
  req,
  res,
  next
) => {
  try {
    const {
      interviewId,
      otp,
    } = req.body;

    if (!interviewId || !otp) {
      return res.status(400).json({
        status: "fail",
        message:
          "Interview ID and 6-digit OTP are required",
      });
    }

    const interview =
      await Interview.findOne({
        _id: interviewId,
      });

    if (!interview) {
      return res.status(404).json({
        status: "fail",
        message:
          "Invalid or expired interview link",
      });
    }

    if (
      interview.accessOtp !==
      otp.toString()
    ) {
      return res.status(401).json({
        status: "fail",
        message:
          "Incorrect 6-digit access code",
      });
    }

    if (interview.status === "completed") {
      return res.status(400).json({
        status: "fail",
        message:
          "This interview has already been completed",
      });
    }

    if (interview.status === "pending") {
      interview.status = "active";
      await interview.save();
    }

    return res.status(200).json({
      status: "success",
      message:
        "Access granted successfully",

      data: {
        interviewId: interview._id,
        jobTitle: interview.jobTitle,
        candidateName:
          interview.candidateName,
        hasAccessPassed: true,
      },
    });

  } catch (error) {
    return next(error);
  }
};

// ==================================================
// TEXT TO SPEECH - AZURE SPEECH
// ==================================================

export const textToSpeech = async (
  req,
  res,
  next
) => {
  let speechSynthesizer = null;

  try {
    const { text } = req.body;

    // Validate text
    if (!text?.trim()) {
      return next(
        new AppError(
          "Text is required for speech generation",
          400
        )
      );
    }

    // Validate Azure configuration
    const speechKey =
      process.env.AZURE_SPEECH_KEY;

    const speechRegion =
      process.env.AZURE_SPEECH_REGION;

    if (!speechKey) {
      console.error(
        "❌ AZURE_SPEECH_KEY is missing"
      );

      return next(
        new AppError(
          "Azure Speech API key is not configured",
          500
        )
      );
    }

    if (!speechRegion) {
      console.error(
        "❌ AZURE_SPEECH_REGION is missing"
      );

      return next(
        new AppError(
          "Azure Speech region is not configured",
          500
        )
      );
    }

    // Azure configuration
    const speechConfig =
      sdk.SpeechConfig.fromSubscription(
        speechKey,
        speechRegion
      );

    speechConfig.speechSynthesisLanguage =
      "en-US";

    speechConfig.speechSynthesisVoiceName =
      "en-US-AvaMultilingualNeural";

    speechConfig.speechSynthesisOutputFormat =
      sdk.SpeechSynthesisOutputFormat
        .Riff24Khz16BitMonoPcm;

    speechSynthesizer =
      new sdk.SpeechSynthesizer(
        speechConfig,
        null
      );

    // Generate speech
    const result = await new Promise(
      (resolve, reject) => {
        speechSynthesizer.speakTextAsync(
          text.trim(),
          (speechResult) =>
            resolve(speechResult),
          (error) =>
            reject(error)
        );
      }
    );

    if (
      result.reason !==
      sdk.ResultReason.SynthesizingAudioCompleted
    ) {
      console.error(
        "❌ Azure Speech synthesis failed:",
        result.errorDetails
      );

      return next(
        new AppError(
          result.errorDetails ||
            "Azure Speech synthesis failed",
          500
        )
      );
    }

    const audioBase64 =
      Buffer.from(
        result.audioData
      ).toString("base64");

    return res.status(200).json({
      status: "success",
      data: {
        audioContent: audioBase64,
        contentType: "audio/wav",
      },
    });

  } catch (error) {
    console.error(
      "❌ Azure TTS Error:",
      error
    );

    return next(
      new AppError(
        error?.message ||
          "Failed to generate speech using Azure Speech",
        500
      )
    );

  } finally {
    if (speechSynthesizer) {
      speechSynthesizer.close();
    }
  }
};

// ==================================================
// SUBMIT GUEST ANSWER
// ==================================================

export const submitGuestAnswer = async (
  req,
  res,
  next
) => {
  try {
    const {
      interviewId,
      questionIndex,
      userAnswer,
    } = req.body;

    if (
      !interviewId ||
      questionIndex === undefined ||
      !userAnswer?.trim()
    ) {
      return res.status(400).json({
        status: "fail",
        message:
          "Missing required fields",
      });
    }

    const interview =
      await Interview.findOne({
        _id: interviewId,
      });

    if (!interview) {
      return res.status(404).json({
        status: "fail",
        message:
          "Session not found",
      });
    }

    if (interview.status === "completed") {
      return res.status(400).json({
        status: "fail",
        message:
          "This session is already closed and evaluated",
      });
    }

    if (interview.status !== "active") {
      return res.status(400).json({
        status: "fail",
        message:
          "Interview session is not active",
      });
    }

    const parsedQuestionIndex =
      Number(questionIndex);

    const questionText =
      interview.questions[
        parsedQuestionIndex
      ];

    if (!questionText) {
      return next(
        new AppError(
          "Invalid question index provided",
          400
        )
      );
    }

    const alreadyAnswered =
      interview.answers.some(
        (answer) =>
          answer.questionIndex ===
          parsedQuestionIndex
      );

    if (alreadyAnswered) {
      return next(
        new AppError(
          "This question has already been answered",
          400
        )
      );
    }

    interview.answers.push({
      questionIndex:
        parsedQuestionIndex,

      questionText,

      userAnswer:
        userAnswer.trim(),
    });

    await interview.save();

    return res.status(200).json({
      status: "success",
      message:
        "Guest answer submitted successfully",

      data: {
        answersCount:
          interview.answers.length,
      },
    });

  } catch (error) {
    return next(error);
  }
};

// ==================================================
// SUBMIT ANSWER
// ==================================================

export const submitAnswer = async (
  req,
  res,
  next
) => {
  try {
    const {
      interviewId,
      questionIndex,
    } = req.body;

    // --------------------------------------------------
    // 1. Basic Validation
    // --------------------------------------------------

    if (
      !interviewId ||
      questionIndex === undefined
    ) {
      return next(
        new AppError(
          "Interview ID and Question Index are required",
          400
        )
      );
    }

    if (!req.file) {
      return next(
        new AppError(
          "Audio answer file is required",
          400
        )
      );
    }

    // --------------------------------------------------
    // 2. Find Interview
    // --------------------------------------------------

    const interview =
      await Interview.findOne({
        _id: interviewId,
        userId: req.user.id,
      });

    if (!interview) {
      return next(
        new AppError(
          "Invalid Interview Session or Unauthorized access",
          404
        )
      );
    }

    // --------------------------------------------------
    // 3. Interview Status Validation
    // --------------------------------------------------

    if (interview.status === "completed") {
      return next(
        new AppError(
          "This interview session is already completed",
          400
        )
      );
    }

    if (interview.status !== "active") {
      return next(
        new AppError(
          "Interview session is not active",
          400
        )
      );
    }

    // --------------------------------------------------
    // 4. Question Validation
    // --------------------------------------------------

    const parsedQuestionIndex =
      Number(questionIndex);

    if (
      !Number.isInteger(parsedQuestionIndex) ||
      parsedQuestionIndex < 0
    ) {
      return next(
        new AppError(
          "Invalid question index provided",
          400
        )
      );
    }

    const questionText =
      interview.questions[
        parsedQuestionIndex
      ];

    if (!questionText) {
      return next(
        new AppError(
          "Invalid question index provided",
          400
        )
      );
    }

    // --------------------------------------------------
    // 5. Duplicate Answer Check
    // --------------------------------------------------

    const alreadyAnswered =
      interview.answers.some(
        (answer) =>
          answer.questionIndex ===
          parsedQuestionIndex
      );

    if (alreadyAnswered) {
      return next(
        new AppError(
          "This question has already been answered",
          400
        )
      );
    }

    // --------------------------------------------------
    // 6. Audio Debug Information
    // --------------------------------------------------

    console.log(
      "🎤 Audio received by backend:",
      {
        mimetype: req.file.mimetype,
        size: req.file.size,
        originalname:
          req.file.originalname,
      }
    );

    console.log(
      "🎤 Audio buffer size:",
      req.file.buffer.length
    );

    console.log(
      "🎤 MIME:",
      req.file.mimetype
    );

    console.log(
      "🎤 FILE SIZE:",
      req.file.size
    );

    console.log(
      "🎤 BUFFER HEADER:",
      req.file.buffer
        .subarray(0, 20)
        .toString("hex")
    );

    // --------------------------------------------------
    // 7. Deepgram Speech-to-Text
    // --------------------------------------------------

    const response =
      await deepgram.listen.v1.media.transcribeFile(
        req.file.buffer,
        {
          model: "nova-3",
          smart_format: true,
          language: "en-US",
          encoding: "opus",
          container: "webm",
        }
      );

    console.log(
      "🔊 Deepgram Full Response:",
      response
    );

    const transcript =
      response?.results
        ?.channels?.[0]
        ?.alternatives?.[0]
        ?.transcript
        ?.trim();

    console.log(
      "📝 Deepgram Transcript:",
      transcript
    );

    // --------------------------------------------------
    // 8. Empty Transcript Protection
    // --------------------------------------------------

    if (!transcript) {
      return next(
        new AppError(
          "No speech detected in the audio. Please try answering again.",
          400
        )
      );
    }

    // --------------------------------------------------
    // 9. Save Answer
    // --------------------------------------------------

    interview.answers.push({
      questionIndex:
        parsedQuestionIndex,

      questionText,

      userAnswer:
        transcript,
    });

    await interview.save();

    // --------------------------------------------------
    // 10. Response
    // --------------------------------------------------

    return res.status(200).json({
      status: "success",
      message:
        "Answer submitted successfully",

      data: {
        answersCount:
          interview.answers.length,

        transcript,
      },
    });

  } catch (error) {
    console.error(
      "❌ Submit Answer Error:",
      error
    );

    return next(error);
  }
};

// ==================================================
// END INTERVIEW
// ==================================================

export const endInterview = async (
  req,
  res,
  next
) => {
  try {
    const { interviewId } =
      req.body;

    // --------------------------------------------------
    // 1. Interview ID Validation
    // --------------------------------------------------

    if (!interviewId) {
      return next(
        new AppError(
          "Interview ID is required to process evaluation",
          400
        )
      );
    }

    // --------------------------------------------------
    // 2. Find Interview
    // --------------------------------------------------

    const interview =
      await Interview.findOne({
        _id: interviewId,
        userId: req.user.id,
      });

    if (!interview) {
      return next(
        new AppError(
          "No active session found with the provided ID",
          404
        )
      );
    }

    // --------------------------------------------------
    // 3. Completed Check
    // --------------------------------------------------

    if (
      interview.status === "completed"
    ) {
      return next(
        new AppError(
          "This interview session has already been evaluated and closed",
          400
        )
      );
    }

    // --------------------------------------------------
    // 4. Active Status Check
    // --------------------------------------------------

    if (interview.status !== "active") {
      return next(
        new AppError(
          "Interview session is not active",
          400
        )
      );
    }

    // --------------------------------------------------
    // 5. Answers Check
    // --------------------------------------------------

    if (
      !interview.answers ||
      interview.answers.length === 0
    ) {
      return next(
        new AppError(
          "Cannot evaluate an interview session with zero submissions",
          400
        )
      );
    }

    // --------------------------------------------------
    // 6. Complete Interview Check
    // --------------------------------------------------

    if (
      interview.answers.length !==
      interview.questions.length
    ) {
      return next(
        new AppError(
          `Interview is incomplete. Expected ${interview.questions.length} answers but received ${interview.answers.length}.`,
          400
        )
      );
    }

    // --------------------------------------------------
    // 7. Prepare Q&A Payload
    // --------------------------------------------------

    const qaPayload =
      interview.answers.map(
        (item) => ({
          questionIndex:
            item.questionIndex,

          questionText:
            item.questionText,

          userAnswer:
            item.userAnswer,
        })
      );

    // --------------------------------------------------
    // 8. AI Evaluation
    // --------------------------------------------------

    console.log(
      "🤖 Starting AI interview evaluation..."
    );

    const aiEvaluationReport =
      await evaluateInterviewSession(
        qaPayload
      );

    // --------------------------------------------------
    // 9. Validate AI Evaluation
    // --------------------------------------------------

    const validScore = (score) =>
      typeof score === "number" &&
      score >= 0 &&
      score <= 10;

    const isValidEvaluation =
      aiEvaluationReport &&
      validScore(
        aiEvaluationReport.overallScore
      ) &&
      validScore(
        aiEvaluationReport.technicalScore
      ) &&
      validScore(
        aiEvaluationReport.communicationScore
      ) &&
      validScore(
        aiEvaluationReport.problemSolvingScore
      ) &&
      Array.isArray(
        aiEvaluationReport.strengths
      ) &&
      Array.isArray(
        aiEvaluationReport.weaknesses
      ) &&
      Array.isArray(
        aiEvaluationReport.recommendedTopics
      ) &&
      Array.isArray(
        aiEvaluationReport.questionWiseEvaluation
      ) &&
      aiEvaluationReport
        .questionWiseEvaluation.length ===
        interview.questions.length;

    if (!isValidEvaluation) {
      console.error(
        "❌ Invalid AI Evaluation:",
        aiEvaluationReport
      );

      return next(
        new AppError(
          "AI returned an invalid evaluation report",
          500
        )
      );
    }

    // --------------------------------------------------
    // 10. Save Evaluation
    // --------------------------------------------------

    interview.evaluation =
      aiEvaluationReport;

    // --------------------------------------------------
    // 11. Close Interview
    // --------------------------------------------------

    interview.status =
      "completed";

    await interview.save();

    // --------------------------------------------------
    // 12. Response
    // --------------------------------------------------

    return res.status(200).json({
      status: "success",

      message:
        "Interview evaluated successfully and session has been closed",

      data: {
        evaluation:
          interview.evaluation,

        status:
          interview.status,
      },
    });

  } catch (error) {
    console.error(
      "❌ End Interview Error:",
      error
    );

    return next(error);
  }
};

// ==================================================
// GET ALL INTERVIEWS
// ==================================================

export const getAllInterviews = async (
  req,
  res,
  next
) => {
  try {
    let query = {
      userId: req.user.id,
    };

    if (req.user.role === "recruiter") {
      query.interviewType =
        "campaign";
    } else {
      query.interviewType =
        "practice";
    }

    const interviews =
      await Interview.find(query)
        .select(
          "questionsSources jobTitle experienceLevel status evaluation.overallScore candidateName candidateEmail createdAt"
        )
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      status: "success",
      results: interviews.length,

      data: {
        interviews,
      },
    });

  } catch (error) {
    return next(error);
  }
};

// ==================================================
// GET INTERVIEW DETAILS
// ==================================================

export const getInterviewDetails = async (
  req,
  res,
  next
) => {
  try {
    const {
      interviewId,
    } = req.params;

    const interview =
      await Interview.findOne({
        _id: interviewId,
        userId: req.user.id,
      });

    if (!interview) {
      return next(
        new AppError(
          "No interview session found with that ID",
          404
        )
      );
    }

    return res.status(200).json({
      status: "success",

      data: {
        interview,
      },
    });

  } catch (error) {
    return next(error);
  }
};

// ==================================================
// GET INTERVIEW REPORT
// ==================================================

export const getInterviewReport = async (
  req,
  res,
  next
) => {
  try {
    const {
      interviewId,
    } = req.params;

    if (!interviewId) {
      return next(
        new AppError(
          "Interview ID is required",
          400
        )
      );
    }

    const interview =
      await Interview.findOne({
        _id: interviewId,
        userId: req.user.id,
      }).select(
        "questions answers evaluation status jobTitle experienceLevel questionsSources createdAt"
      );

    if (!interview) {
      return next(
        new AppError(
          "Interview report not found",
          404
        )
      );
    }

    if (
      interview.status !== "completed"
    ) {
      return next(
        new AppError(
          "Interview has not been evaluated yet",
          400
        )
      );
    }

    return res.status(200).json({
      status: "success",

      message:
        "Interview report fetched successfully",

      data: {
        interview,
      },
    });

  } catch (error) {
    console.error(
      "❌ Get Interview Report Error:",
      error
    );

    return next(error);
  }
};