import { BrevoClient } from "@getbrevo/brevo";

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
});

export const sendOtpEmail = async ({ email, otp, purpose }) => {
  const subjectMap = {
    signup: "Verify your account - OTP",
    login: "Your Login OTP",
    "forgot-password": "Reset Password OTP",
  };

  const subject = subjectMap[purpose] || "Your OTP Code";

  await brevo.transactionalEmails.sendTransacEmail({
    sender: {
      email: process.env.BREVO_SENDER_EMAIL,
      name: process.env.BREVO_SENDER_NAME || "AceGrad AI",
    },

    to: [
      {
        email,
      },
    ],

    subject,

    htmlContent: `
      <div style="
        font-family: Arial, sans-serif;
        padding: 30px;
        background: #030712;
        border-radius: 12px;
        max-width: 500px;
        margin: auto;
      ">

        <h2 style="color: #ffffff;">
          AceGrad AI
        </h2>

        <p style="color: #d1d5db;">
          Use the verification code below to continue:
        </p>

        <div style="
          margin: 25px 0;
          padding: 18px;
          text-align: center;
          background: #0d1538;
          border-radius: 10px;
          border: 1px solid #d90000;
        ">
          <h1 style="
            color: #ffffff;
            letter-spacing: 8px;
            margin: 0;
          ">
            ${otp}
          </h1>
        </div>

        <p style="
          color: #9ca3af;
          font-size: 14px;
        ">
          This OTP is valid for 5 minutes only.
        </p>

        <p style="
          color: #9ca3af;
          font-size: 14px;
        ">
          If you didn't request this code, you can safely ignore this email.
        </p>

        <p style="color: #d1d5db;">
          — AceGrad AI Team
        </p>

      </div>
    `,

    textContent: `
AceGrad AI

Your OTP is: ${otp}

This OTP is valid for 5 minutes only.

If you didn't request this code, you can safely ignore this email.
    `,
  });
};