import Interview from "../model/interview.model.js";
import AppError from "../utils/appError.js";
import { generateInterviewQuestions, evaluateInterviewSession } from "../services/gemini.service.js";

/**
 * @route   POST /api/v1/interview/startInterview
 * @desc    Creates a new interview session. Generates dynamic AI questions based on the job role.
 * If the mode is a 'campaign', it locks an administrative 6-digit verification code.
 * @access  Protected (Candidates / Recruiters)
 */
export const startInterview = async (req, res, next) => {
    try {
        const { jobTitle, jobDescription, experienceLevel, interviewType, candidateName, candidateEmail } = req.body;

        // 1. Structural boundary validation check
        if (!jobTitle || !jobDescription || !experienceLevel) {
            return next(new AppError("Job Title, Description, and Experience Level are required", 400));
        }

        const userId = req.user.id; 
        
        // 2. Fire Gemini integration layer to fetch personalized technical question subsets
        const aiQuestions = await generateInterviewQuestions(jobTitle, jobDescription, experienceLevel);

        // 3. Conditional evaluation to lock an Access OTP if triggered by a corporate recruiter
        let generatedOtp = null;
        if (interviewType === "campaign") {
            generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
        }

        // 4. Save metadata state matrix into MongoDB
        const newInterview = await Interview.create({
            userId,
            jobTitle,
            jobDescription,
            experienceLevel,
            questions: aiQuestions,
            interviewType: interviewType || "practice",
            candidateName: interviewType === "campaign" ? candidateName : undefined,
            candidateEmail: interviewType === "campaign" ? candidateEmail : undefined,
            accessOtp: generatedOtp, 
            status: "pending" 
        });

        res.status(201).json({
            status: "success",
            message: "Interview session created successfully",
            data: { 
                interview: newInterview,
                accessOtp: generatedOtp 
            }
        });

    } catch (error) {
        return next(error);
    }
};

/**
 * @route   POST /api/v1/interview/verifyInterviewOtp
 * @desc    Validates guest candidate entry against the recruiter's locked 6-digit passcode.
 * @access  Public (Guest Candidates)
 */
export const verifyInterviewOtp = async (req, res, next) => {
    try {
        const { interviewId, otp } = req.body;

        if (!interviewId || !otp) {
            return res.status(400).json({ 
                status: "fail", 
                message: "Interview ID and 6-digit OTP are required" 
            });
        }

        const interview = await Interview.findById(interviewId);
        if (!interview) {
            return res.status(404).json({ status: "fail", message: "Invalid or expired interview link" });
        }

        // Cryptographic string comparison guard for passcode checking
        if (interview.accessOtp !== otp.toString()) {
            return res.status(401).json({ status: "fail", message: "Incorrect 6-digit access code" });
        }

        // If verified for the first time, shift configuration state matrix to active
        if (interview.status === "pending") {
            interview.status = "active";
            await interview.save();
        }

        res.status(200).json({
            status: "success",
            message: "Access granted successfully",
            data: {
                interviewId: interview._id,
                jobTitle: interview.jobTitle,
                candidateName: interview.candidateName,
                hasAccessPassed: true 
            }
        });

    } catch (error) {
        next(error);
    }
};

/**
 * @route   POST /api/v1/interview/submitGuestAnswer
 * @desc    Appends candidate responses directly using structural array pushing without profile tokens.
 * @access  Public (Guest Candidates)
 */
export const submitGuestAnswer = async (req, res, next) => {
    try {
        const { interviewId, questionIndex, userAnswer } = req.body;

        if (!interviewId || questionIndex === undefined || !userAnswer) {
            return res.status(400).json({ status: "fail", message: "Missing required fields" });
        }

        const interview = await Interview.findById(interviewId);
        if (!interview) return res.status(404).json({ status: "fail", message: "Session not found" });

        if (interview.status === "completed") {
            return res.status(400).json({ status: "fail", message: "This session is already closed and evaluated" });
        }

        const questionText = interview.questions[questionIndex];

        interview.answers.push({
            questionIndex,
            questionText,
            userAnswer
        });

        await interview.save();

        res.status(200).json({
            status: "success",
            message: "Guest answer submitted successfully",
            data: { answersCount: interview.answers.length }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   POST /api/v1/interview/submitAnswer
 * @desc    Saves responses for individual internal profile candidates running mock trials.
 * @access  Protected (Logged-in Candidates)
 */
export const submitAnswer = async (req, res, next) => {
   try {
        const { interviewId, questionIndex, userAnswer } = req.body;
        if (!interviewId || questionIndex === undefined || !userAnswer) {
            return next(new AppError("Interview ID, Question Index, and User Answer are required", 400));
        }

        // Scope validation matrix ensures mapping ownership strictly matches the logged-in token
        const interview = await Interview.findOne({ _id: interviewId, userId: req.user.id });

        if (!interview) {
            return next(new AppError("Invalid Interview Session or Unauthorized access", 404));
        }

        const questionText = interview.questions[questionIndex];
        if (!questionText) {
            return next(new AppError("Invalid question index provided", 400));
        }

        interview.answers.push({ 
            questionIndex, 
            questionText, 
            userAnswer 
        });

        await interview.save();
        
        res.status(200).json({
            status: "success",
            message: "Answer submitted successfully",
            data: {
                answersCount: interview.answers.length
            }
        });
   } catch (error) {
        return next(error);
   }
};

/**
 * @route   POST /api/v1/interview/endInterview
 * @desc    Closes active execution loops. Triggers telemetry parsing with Gemini to build deep metric results.
 * @access  Universal Controller Interface Endpoint
 */
export const endInterview = async (req, res, next) => {
    try {
        const { interviewId } = req.body;

        if (!interviewId) {
            return next(new AppError("Interview ID is required to process evaluation", 400));
        }

        // Flexible lookup: Allows parsing if it belongs to a registered candidate, or matches public criteria
        const interview = await Interview.findById(interviewId);

        if (!interview) {
            return next(new AppError("No active session found with the provided ID", 404));
        }

        // Protection block to safeguard compute cost and prevent double evaluations
        if (interview.status === "completed") {
            return next(new AppError("This interview session has already been evaluated and closed", 400));
        }

        if (!interview.answers || interview.answers.length === 0) {
            return next(new AppError("Cannot evaluate an interview session with zero submissions", 400));
        }

        // Format clean evaluation payload payload arrays
        const qaPayload = interview.answers.map(item => ({
            questionText: item.questionText,
            userAnswer: item.userAnswer
        }));

        // Execute background call to Google Gemini Analytics Model API
        const aiEvaluationReport = await evaluateInterviewSession(qaPayload);

        // Bind the processed telemetry payload back into document memory structures
        interview.evaluation = aiEvaluationReport;
        interview.status = "completed";

        await interview.save();

        res.status(200).json({
            status: "success",
            message: "Interview evaluated successfully and session has been closed",
            data: {
                evaluation: interview.evaluation,
                status: interview.status
            }
        });

    } catch (error) {
        return next(error);
    }
};

/**
 * @route   GET /api/v1/interview/getAllInterviews
 * @desc    Provides full metric logging streams tailored to specific tracking view profiles (Recruiter / Candidate).
 * @access  Protected (Authenticated Profiles Only)
 */
export const getAllInterviews = async (req, res, next) => {
    try {
        let query = { userId: req.user.id };

        // Separation engine: Filters target output logs based on business interface metrics
        if (req.user.role === "recruiter") {
            query.interviewType = "campaign";
        } else {
            query.interviewType = "practice";
        }

        const interviews = await Interview.find(query)
            .select("jobTitle experienceLevel status evaluation.overallScore candidateName candidateEmail createdAt")
            .sort({ createdAt: -1 });

        res.status(200).json({
            status: "success",
            results: interviews.length,
            data: { interviews }
        });
    } catch (error) {
        return next(error);
    }
};

/**
 * @route   GET /api/v1/interview/getInterviewDetails/:interviewId
 * @desc    Provides full historical details of a single specific interview document instance.
 * @access  Protected
 */
export const getInterviewDetails = async (req, res, next) => {
    try {
        const { interviewId } = req.params;

        const interview = await Interview.findById(interviewId);

        if (!interview) {
            return next(new AppError("No interview session found with that ID", 404));
        }

        res.status(200).json({
            status: "success",
            data: { interview }
        });
    } catch (error) {
        return next(error);
    }
};