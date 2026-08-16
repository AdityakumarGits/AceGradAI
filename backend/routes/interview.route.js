import express from "express";
import {protect} from "../middlewares/protectedMiddleware.js";
import { startInterview,submitAnswer,endInterview,getAllInterviews,getInterviewDetails} from "../controller/interview.controller.js";
import { verifyInterviewOtp, submitGuestAnswer } from "../controller/interview.controller.js"; // Import new helpers
import multer from "multer";



const route=express.Router();

// 🔓 PUBLIC ROUTES (For Campaign Guest Candidates - No Auth Required)
route.post("/verifyInterviewOtp", verifyInterviewOtp);
route.post("/submitGuestAnswer", submitGuestAnswer);

// 🔒 PROTECTED ROUTES (Requires Login JWT Token)
route.post("/startInterview",protect,multer,startInterview);
router.post('/textToSpeech', protect, textToSpeech);
route.post("/submitAnswer",protect,submitAnswer);
route.post("/endInterview", protect, endInterview);
route.get("/getAllInterviews", protect, getAllInterviews);
route.get("/getInterviewDetails/:interviewId", protect, getInterviewDetails);



export default route;