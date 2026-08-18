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
 *          Questions are generated based on:
 *          1. JD
 *          2. Topics
 *          3. Resume
 *
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
    // 2. Source Specific Validation
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
    // 3. Logged-in User
    // --------------------------------------------------

    const userId = req.user.id;

    // --------------------------------------------------
    // 4. Generate AI Questions
    // --------------------------------------------------

    let aiQuestions;

    // ---------------------------------------------
    // JD
    // ---------------------------------------------

    if (questionsSources === "jd") {
      aiQuestions = await generateInterviewQuestions(
        jobTitle.trim(),
        jobDescription.trim(),
        experienceLevel
      );
    }

    // ---------------------------------------------
    // Topics
    // ---------------------------------------------

    else if (questionsSources === "topics") {
      aiQuestions =
        await generateTopicInterviewQuestions(
          topics,
          experienceLevel
        );
    }

    // ---------------------------------------------
    // Resume
    // ---------------------------------------------

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
    // 5. Validate Gemini Response
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
    // 6. Campaign OTP
    // --------------------------------------------------

    let generatedOtp = null;

    if (interviewType === "campaign") {
      generatedOtp = Math.floor(
        100000 + Math.random() * 900000
      ).toString();
    }

    // --------------------------------------------------
    // 7. Create Interview
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

        interviewType:
          interviewType || "practice",

        candidateName:
          interviewType === "campaign"
            ? candidateName
            : undefined,

        candidateEmail:
          interviewType === "campaign"
            ? candidateEmail
            : undefined,

        accessOtp: generatedOtp,

        status: "pending",
      });

    // --------------------------------------------------
    // 8. Response
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
// TEXT TO SPEECH
// ==================================================

// ==================================================
// TEXT TO SPEECH - AZURE SPEECH
// ==================================================

export const textToSpeech = async (req, res, next) => {
  let speechSynthesizer = null;

  try {
    const { text } = req.body;

    // ---------------------------------------------
    // 1. Validate text
    // ---------------------------------------------

    if (!text?.trim()) {
      return next(
        new AppError("Text is required for speech generation", 400)
      );
    }

    // ---------------------------------------------
    // 2. Validate Azure configuration
    // ---------------------------------------------

    const speechKey = process.env.AZURE_SPEECH_KEY;
    const speechRegion = process.env.AZURE_SPEECH_REGION;

    if (!speechKey) {
      console.error("❌ AZURE_SPEECH_KEY is missing");

      return next(
        new AppError(
          "Azure Speech API key is not configured",
          500
        )
      );
    }

    if (!speechRegion) {
      console.error("❌ AZURE_SPEECH_REGION is missing");

      return next(
        new AppError(
          "Azure Speech region is not configured",
          500
        )
      );
    }

    // ---------------------------------------------
    // 3. Create Azure Speech configuration
    // ---------------------------------------------

    const speechConfig = sdk.SpeechConfig.fromSubscription(
      speechKey,
      speechRegion
    );

    // ---------------------------------------------
    // 4. Configure Mira voice
    // ---------------------------------------------

    speechConfig.speechSynthesisLanguage = "en-US";

    speechConfig.speechSynthesisVoiceName =
      "en-US-AvaMultilingualNeural";

    // ---------------------------------------------
    // 5. Configure audio format
    // ---------------------------------------------

    speechConfig.speechSynthesisOutputFormat =
      sdk.SpeechSynthesisOutputFormat.Riff24Khz16BitMonoPcm;

    // ---------------------------------------------
    // 6. null audioConfig
    //
    // This tells Azure:
    // "Don't play audio on backend machine.
    // Give me the generated audio bytes."
    // ---------------------------------------------

    speechSynthesizer = new sdk.SpeechSynthesizer(
      speechConfig,
      null
    );

    // ---------------------------------------------
    // 7. Generate speech
    // ---------------------------------------------
console.log("TTS RESPONSE:", {
  audioContentExists: !!audioBase64,
  audioLength: audioBase64?.length,
  contentType: "audio/wav",
});
    const result = await new Promise((resolve, reject) => {
      speechSynthesizer.speakTextAsync(
        text.trim(),

        (speechResult) => {
          resolve(speechResult);
        },

        (error) => {
          reject(error);
        }
      );
    });

    // ---------------------------------------------
    // 8. Check Azure result
    // ---------------------------------------------

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

    // ---------------------------------------------
    // 9. Convert audio bytes → Base64
    // ---------------------------------------------

    const audioBase64 = Buffer.from(
      result.audioData
    ).toString("base64");

    // ---------------------------------------------
    // 10. Response
    // ---------------------------------------------

    return res.status(200).json({
      status: "success",

      data: {
        audioContent: audioBase64,
        contentType: "audio/wav",
      },
    });
    console.log("AZURE TTS SUCCESS:", {
  reason: result.reason,
  audioLength: result.audioData?.length,
});

  } catch (error) {
    console.error("❌ Azure TTS Error:", error);

    return next(
      new AppError(
        error?.message ||
          "Failed to generate speech using Azure Speech",
        500
      )
    );

  } finally {
    // ---------------------------------------------
    // 11. Cleanup
    // ---------------------------------------------

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
      !userAnswer
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

    if (
      interview.status === "completed"
    ) {
      return res.status(400).json({
        status: "fail",
        message:
          "This session is already closed and evaluated",
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

      userAnswer,
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

    // ---------------------------------------------
    // Deepgram
    // ---------------------------------------------

    const {
      result,
      error: deepgramError,
    } =
      await deepgram.listen.v1.media.transcribeFile(
        req.file.buffer,
        {
          model: "nova-3",
          smart_format: true,
        }
      );

    if (deepgramError) {
      console.error(
        "❌ Deepgram Error:",
        deepgramError
      );

      return next(
        new AppError(
          "Failed to transcribe audio answer",
          500
        )
      );
    }

    const transcript =
      result?.results?.channels?.[0]
        ?.alternatives?.[0]
        ?.transcript?.trim();

    if (!transcript) {
      return next(
        new AppError(
          "No speech detected in the audio. Please try answering again.",
          400
        )
      );
    }

    interview.answers.push({
      questionIndex:
        parsedQuestionIndex,

      questionText,

      userAnswer: transcript,
    });

    await interview.save();

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
    const { interviewId } = req.body;

    if (!interviewId) {
      return next(
        new AppError(
          "Interview ID is required to process evaluation",
          400
        )
      );
    }

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

    const qaPayload =
      interview.answers.map(
        (item) => ({
          questionText:
            item.questionText,

          userAnswer:
            item.userAnswer,
        })
      );

    const aiEvaluationReport =
      await evaluateInterviewSession(
        qaPayload
      );

    interview.evaluation =
      aiEvaluationReport;

    interview.status =
      "completed";

    await interview.save();

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
    const { interviewId } =
      req.params;

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