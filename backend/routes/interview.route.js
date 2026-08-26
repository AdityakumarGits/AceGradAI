import express from "express";
import {protect} from "../middlewares/protectedMiddleware.js";
import { startInterview,textToSpeech,submitAnswer,endInterview,getAllInterviews,getInterviewDetails,getInterviewReport,} from "../controller/interview.controller.js";
import { verifyInterviewOtp, submitGuestAnswer } from "../controller/interview.controller.js"; // Import new helpers
import multer from "multer";



const router=express.Router();
// Memory-storage — files ko disk pe save nahi karte, seedha buffer me rakhte hain
// (chhoti files — resume-PDF, answer-audio — turant process hoti hain, permanent storage ki zarurat nahi)
const upload = multer({ storage: multer.memoryStorage() });
 
// resume-mode me PDF file 'resume' field-name se aayegi
router.post("/startInterview", protect, upload.single("resume"), startInterview);
 
// candidate ka spoken-answer 'audio' field-name se aayega 
//protected route
router.post("/submitAnswer", protect, upload.single("audio"), submitAnswer);
 
router.post("/textToSpeech", protect, textToSpeech);
router.post("/verifyInterviewOtp", verifyInterviewOtp);
router.post("/submitGuestAnswer", submitGuestAnswer);
router.post("/endInterview", protect, endInterview);
router.get("/getAllInterviews", protect, getAllInterviews);
router.get("/getInterviewDetails/:interviewId", protect, getInterviewDetails);
router.get("/:interviewId/report",protect,getInterviewReport);

export default router;