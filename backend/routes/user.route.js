import express from"express";
import { signUp,login, verifyOTP, SendOtp, resendOtp, forgetPassword, resetPassword } from "../controller/user.controller.js"; 
const route=express.Router();

import rateLimit from "express-rate-limit";
import { protect } from "../middlewares/protectedMiddleware.js";

const otpLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 5, // max 5 requests
    message: "Too many OTP requests, please try again later"
});


route.post("/signup",signUp );
route.post("/send-otp", otpLimiter, SendOtp);
route.post("/resend-otp", otpLimiter, resendOtp);
route.post("/verify-otp", otpLimiter, verifyOTP);

route.post("/login",login);
route.post("/forget-password", otpLimiter, forgetPassword);
route.post("/reset-password",resetPassword);
//route.post("/logout", protect, logout);




export default route;