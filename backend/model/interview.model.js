import mongoose from "mongoose";

/**
 * @description Interview Session Schema
 * Supports:
 * 1. Candidate Self-Practice (B2C)
 * 2. Recruiter Campaign Interviews (B2B)
 *
 * Question sources:
 * - jd
 * - topics
 * - resume
 */

const interviewSchema = new mongoose.Schema(
  {
    // --------------------------------------------------
    // 1. Owner
    // --------------------------------------------------
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: function () {
        return this.interviewType === "practice";
      },
    },

    // --------------------------------------------------
    // 2. Interview Type
    // --------------------------------------------------
    interviewType: {
      type: String,
      enum: ["practice", "campaign"],
      default: "practice",
    },

    // --------------------------------------------------
    // 3. Campaign Candidate Information
    // --------------------------------------------------
    candidateName: {
      type: String,
      trim: true,
      required: function () {
        return this.interviewType === "campaign";
      },
    },

    candidateEmail: {
      type: String,
      trim: true,
      lowercase: true,
      required: function () {
        return this.interviewType === "campaign";
      },
    },

    accessOtp: {
      type: String,
      trim: true,
    },

    // --------------------------------------------------
    // 4. Question Source
    // --------------------------------------------------
    questionsSources: {
      type: String,
      enum: ["jd", "topics", "resume"],
      required: [true, "Question source is required"],
    },

    // --------------------------------------------------
    // 5. JD Information
    // Only required when source = jd
    // --------------------------------------------------
    jobTitle: {
      type: String,
      trim: true,
      required: function () {
        return this.questionsSources === "jd";
      },
    },

    jobDescription: {
      type: String,
      trim: true,
      required: function () {
        return this.questionsSources === "jd";
      },
    },

    // --------------------------------------------------
    // 6. Experience Level
    // --------------------------------------------------
    experienceLevel: {
      type: String,
      enum: ["fresher", "junior", "mid", "senior"],
      required: [true, "Experience level is required"],
    },

    // --------------------------------------------------
    // 7. Selected Topics
    // Only populated when source = topics
    // --------------------------------------------------
    topics: {
      type: [String],
      default: [],
    },

    // --------------------------------------------------
    // 8. AI Generated Questions
    // --------------------------------------------------
    questions: {
      type: [String],
      required: [true, "AI generated questions are required"],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: "At least one question is required",
      },
    },

    // --------------------------------------------------
    // 9. Candidate Answers
    // --------------------------------------------------
    answers: [
      {
        questionIndex: {
          type: Number,
          required: true,
        },

        questionText: {
          type: String,
          required: true,
        },

        userAnswer: {
          type: String,
          required: true,
        },
      },
    ],

    // --------------------------------------------------
    // 10. AI Evaluation
    // --------------------------------------------------
    evaluation: {
      overallScore: {
        type: Number,
        min: 0,
        max: 10,
      },

      feedbackSummary: {
        type: String,
      },

      skillsAssessment: {
        type: [String],
      },
    },

    // --------------------------------------------------
    // 11. Interview Status
    // --------------------------------------------------
    status: {
      type: String,
      enum: ["pending", "active", "expired", "completed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

// Useful for candidate interview history
interviewSchema.index({
  userId: 1,
  status: 1,
});

const Interview = mongoose.model("Interview", interviewSchema);

export default Interview;