import Interview from "../model/interview.model.js";
import { evaluateInterviewSession } from "./gemini.service.js";


// ==========================================
// VALIDATE AI EVALUATION
// ==========================================

const isValidEvaluation = (evaluation, totalQuestions) => {
  const validScore = (score) =>
    typeof score === "number" &&
    score >= 0 &&
    score <= 10;

  if (!evaluation) {
    return false;
  }

  if (!validScore(evaluation.overallScore)) {
    return false;
  }

  if (!validScore(evaluation.technicalScore)) {
    return false;
  }

  if (!validScore(evaluation.communicationScore)) {
    return false;
  }

  if (!validScore(evaluation.problemSolvingScore)) {
    return false;
  }

  if (!Array.isArray(evaluation.strengths)) {
    return false;
  }

  if (!Array.isArray(evaluation.weaknesses)) {
    return false;
  }

  if (!Array.isArray(evaluation.recommendedTopics)) {
    return false;
  }

  if (!Array.isArray(evaluation.questionWiseEvaluation)) {
    return false;
  }

  if (
    evaluation.questionWiseEvaluation.length !==
    totalQuestions
  ) {
    return false;
  }

  return true;
};


// ==========================================
// START INTERVIEW EVALUATION
// ==========================================

export const startInterviewEvaluation = async ({
  interviewId,
  userId,
  io,
}) => {
  const interview = await Interview.findOne({
    _id: interviewId,
    userId,
  });

  if (!interview) {
    throw new Error(
      "Interview not found or unauthorized access",
    );
  }

  if (interview.status === "completed") {
    throw new Error(
      "Interview has already been completed",
    );
  }

  if (interview.status !== "active") {
    throw new Error(
      "Interview session is not active",
    );
  }

  if (
    !interview.answers ||
    interview.answers.length === 0
  ) {
    throw new Error(
      "Cannot evaluate interview without answers",
    );
  }

  if (
    interview.answers.length !==
    interview.questions.length
  ) {
    throw new Error(
      `Interview is incomplete. Expected ${interview.questions.length} answers but received ${interview.answers.length}.`,
    );
  }


  // ==========================================
  // PREPARE QUESTIONS + ANSWERS
  // ==========================================

  const qaPayload = interview.answers.map((item) => ({
    questionIndex: item.questionIndex,
    questionText: item.questionText,
    userAnswer: item.userAnswer,
  }));


  // ==========================================
  // MARK INTERVIEW AS COMPLETED
  // ==========================================

  interview.status = "completed";

  interview.evaluation =
    interview.evaluation || {};

  interview.evaluation.evaluationStatus =
    "processing";

  await interview.save();


  console.log("🚀 Interview evaluation started:", {
    interviewId,
    userId,
  });


  // ==========================================
  // INFORM FRONTEND
  // ==========================================

  if (io) {
    io.to(`interview:${interviewId}`).emit(
      "evaluation-processing",
      {
        interviewId,
        status: "processing",
      },
    );
  }


  // ==========================================
  // RUN GEMINI IN BACKGROUND
  // ==========================================

  evaluateInterviewSession(qaPayload)
    .then(async (evaluation) => {
      console.log(
        "🤖 Gemini evaluation completed:",
        interviewId,
      );


      // Check Gemini response
      if (
        !isValidEvaluation(
          evaluation,
          interview.questions.length,
        )
      ) {
        console.error(
          "❌ Invalid AI evaluation:",
          evaluation,
        );

        interview.evaluation.evaluationStatus =
          "failed";

        await interview.save();

        if (io) {
          io.to(`interview:${interviewId}`).emit(
            "evaluation-failed",
            {
              interviewId,
              message:
                "AI evaluation could not be completed",
            },
          );
        }

        return;
      }


      // ==========================================
      // SAVE EVALUATION
      // ==========================================

      interview.evaluation = {
        ...evaluation,
        evaluationStatus: "completed",
      };

      await interview.save();


      console.log(
        "💾 Evaluation saved successfully:",
        interviewId,
      );


      // ==========================================
      // SEND RESULT TO FRONTEND
      // ==========================================

      if (io) {
        io.to(`interview:${interviewId}`).emit(
          "evaluation-completed",
          {
            interviewId,
            evaluation: interview.evaluation,
          },
        );
      }
    })
    .catch(async (error) => {
      console.error(
        "❌ Background AI evaluation error:",
        error,
      );

      try {
        interview.evaluation =
          interview.evaluation || {};

        interview.evaluation.evaluationStatus =
          "failed";

        await interview.save();

        if (io) {
          io.to(`interview:${interviewId}`).emit(
            "evaluation-failed",
            {
              interviewId,
              message:
                "AI evaluation failed",
            },
          );
        }
      } catch (saveError) {
        console.error(
          "❌ Failed to save evaluation failure:",
          saveError,
        );
      }
    });


  // ==========================================
  // RETURN IMMEDIATELY
  // ==========================================

  return {
    status: "processing",
    interviewId,
  };
};