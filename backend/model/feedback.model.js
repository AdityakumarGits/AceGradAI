import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
    interviewId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Interview", // Direct Interview session model se linkage
        required: [true, "Feedback must be linked to an active interview session"]
    },
    questionText: {
        type: String,
        required: [true, "Question text is required"]
    },
    userTranscript: {
        type: String,
        required: [true, "Candidate's audio response transcript is required"]
    },
    // AI Evaluation Details (Deep Nested JSON Matrix)
    aiEvaluation: {
        score: {
            type: Number,
            required: [true, "AI score out of 10 is required"],
            min: 0,
            max: 10
        },
        technicalFeedback: {
            type: String,
            required: [true, "Core technical accuracy feedback is required"]
        },
        communicationFeedback: {
            type: String,
            required: [true, "Communication clearity feedback is required"]
        },
        improvedAnswer: {
            type: String,
            required: [true, "AI generated standard ideal answer is required"]
        }
    }
}, {
    timestamps: true
});

const Feedback = mongoose.model("Feedback", feedbackSchema);
export default Feedback;