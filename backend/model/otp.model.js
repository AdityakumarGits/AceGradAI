import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    otp: {
        type: String,
        required: true
    },
    purpose: {
        type: String,
        enum: ["signup", "login", "forgot-password"],
        default: "signup"
    },
    attempts: {
        type: Number,
        default: 0
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 } // TTL — sirf OTP document delete hoga, User nahi
    }
}, { timestamps: true });

const Otp = mongoose.model("Otp", otpSchema);
export default Otp;