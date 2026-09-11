import Otp from "../model/otp.model.js";
import { sendOtpEmail } from "../services/brevo.service.js";

export const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export const createAndSendOtp = async (email, purpose = "signup") => {
  const otp = generateOtp();

  // Replace existing OTP record
  await Otp.findOneAndUpdate(
    { email },
    {
      otp,
      purpose,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      attempts: 0,
    },
    {
      upsert: true,
      new: true,
    }
  );

  try {
    await sendOtpEmail({
      email,
      otp,
      purpose,
    });
  } catch (error) {
    console.error("Brevo OTP Email Error:", error);

    // Email failed → remove OTP record
    await Otp.deleteOne({ email });

    throw new Error("Failed to send OTP email. Please try again.");
  }

  return otp;
};