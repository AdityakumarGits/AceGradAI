import { Resend } from "resend";
import Otp from "../model/otp.model.js";

const resend = new Resend(process.env.RESEND_API_KEY);
//console.log("RESEND KEY LOADED:", process.env.RESEND_API_KEY ? "YES" : "NO");

export const generateOtp = () => 
    Math.floor(100000 + Math.random() * 900000).toString();

export const createAndSendOtp = async (email, purpose = "signup") => {
    const otp = generateOtp();

    // Purana OTP record replace karo (agar hai to), warna naya banao
    await Otp.findOneAndUpdate(
        { email },
        { 
            otp, 
            purpose, 
            expiresAt: new Date(Date.now() + 5 * 60 * 1000), 
            attempts: 0 
        },
        { upsert: true, new: true }
    );

    const subjectMap = {
        "signup": "Verify your account - OTP",
        "login": "Your Login OTP",
        "forgot-password": "Reset Password OTP"
    };

    try {
        await resend.emails.send({
            from: "onboarding@resend.dev", // domain verify hone tak yehi use karo
            to: email,
            subject: subjectMap[purpose] || "Your OTP Code",
            html: `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; max-width: 500px;">
                    <h2 style="color: #ef4444;">${subjectMap[purpose] || "OTP Verification"}</h2>
                    <p>Use the code below to proceed:</p>
                    <h1 style="color: #1e293b; letter-spacing: 4px; background: #fef2f2; padding: 10px; text-align: center; border-radius: 6px; border: 1px solid #fca5a5;">${otp}</h1>
                    <p style="color: #64748b; font-size: 14px;">Valid for 5 minutes only.</p>
                </div>
            `
        });
    } catch (error) {
        // Email fail hua to OTP record delete kar do — warna user OTP maang chuka hai but mail nahi mila, phir bhi Otp collection me entry rahegi
        await Otp.deleteOne({ email });
        throw new Error("Failed to send OTP email. Please try again.");
    }

    return otp;
};