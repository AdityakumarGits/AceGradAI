import {
  ShieldCheck,Mail,ArrowRight,ArrowLeft,RefreshCw,} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { candidateToast } from "../utils/toast";
import axios from "axios";

import { useEffect, useState,useRef } from "react";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
 const [otp,setOtp] = useState(["","","","","",""]);
  const [email,setEmail]= useState(location.state?.email || "");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  useEffect(() => {
  if (!email) {
    candidateToast.error("Session expired. Please sign up again.");
    navigate("/signup");
  }
}, [email, navigate]);
  useEffect(()=>{
    if(timer > 0){
        const interval=setInterval(()=>{
            setTimer((prev)=>prev-1);
        },1000);
        return ()=>clearInterval(interval);
    }
  },[timer]);
  const inputRefs = useRef([]);

  const handleVerifyOTP = async (e) => {
      e.preventDefault();

       if(!/^\d{6}$/.test(otp.join(""))){
         candidateToast.error("Enter a valid 6-digit OTP");
         return;
       }
    
    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/api/v1/auth/verify-otp",
        {
          email,
          otp: otp.join("")
        },
      );
      candidateToast.success("OTP verified successfully.");
      navigate("/login");
      console.log(response.data);
    } catch (error) {
      console.error(error);
      candidateToast.error(
        error.response?.data?.message || "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };
 //resend OTP
  const handleResendOTP = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/auth/resendOtp",
        {
          email,
        },
      );
      candidateToast.success("OTP Send To Your Email");
      setTimer(60);
      console.log(response.data);
    } catch (error) {
      console.log(error);
      candidateToast.error("Failed to deliver OTP")
    }
  };
  const handlePaste = (e) => {
  e.preventDefault();
  const pastedData = e.clipboardData.getData("text").trim();
  
  if (!/^\d{6}$/.test(pastedData)) return; // invalid paste ignore karo
  
  const newOtp = pastedData.split("");
  setOtp(newOtp);
  
  // last box par focus bhej do
  inputRefs.current[5]?.focus();
};
  return (
    <div className="relative h-screen overflow-hidden bg-gradient-to-br from-[#030712] via-[#070f2b] to-[#0f172a] flex items-center justify-center px-6 py-10">
      {/* Background Glow */}
      <div className="absolute -top-40 -left-32 h-[380px] w-[380px] rounded-full bg-[#d90000]/20 blur-[180px]" />
      <div className="absolute bottom-0 right-0 h-[450px] w-[450px] rounded-full bg-indigo-600/20 blur-[220px]" />

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="rounded-3xl border border-white/10 bg-[#0d1538]/80 backdrop-blur-xl p-8 shadow-2xl">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#d90000] to-indigo-600 shadow-lg">
              <ShieldCheck className="text-white" size={34} />
            </div>
          </div>

          {/* Heading */}

          <div className="mt-6 text-center">
            <h1 className="text-3xl font-bold text-white">
              Verify Your Account
            </h1>

            <p className="mt-3 text-sm text-[#eaecf0]/60">
              Enter the 6-digit verification code sent to your registered email
              address.
            </p>
          </div>

          {/* Email Display */}

          <div className="mt-8 flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-[#030712]/60 py-3">
            <Mail size={18} className="text-[#d90000]" />

            <span className="text-sm text-[#eaecf0]/80">{email}</span>
          </div>

          {/* OTP Inputs */}

          <div className="mt-8">
            <label className="mb-4 block text-center text-sm font-medium text-[#eaecf0]/80">
              Verification Code
            </label>

            <div className="flex justify-center gap-3">
              {[1, 2, 3, 4, 5, 6].map((item,index) => (
                <input

                     onPaste={handlePaste}
                  key={item}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="one-time-code"
                  value={otp[index]}
                 onChange={(e) => {
  const value = e.target.value;
  if (!/^\d?$/.test(value)) return;   // sirf empty ya single digit allow
  const newOtp = [...otp];
  newOtp[index] = value;
  setOtp(newOtp);
  if (value && index < 5) {
  inputRefs.current[index + 1]?.focus();
}
}}
ref={(el) => (inputRefs.current[index] = el)}
onKeyDown={(e) => {
  if (e.key === "Backspace" && !otp[index] && index > 0) {
    const newOtp = [...otp];
    newOtp[index - 1] = "";
    setOtp(newOtp);
    inputRefs.current[index - 1]?.focus();
  }
}}
                 
    
                  
                  maxLength="1"
                  className="h-14 w-14 rounded-2xl border border-white/10 bg-[#030712]/70 text-center text-xl font-bold text-white outline-none transition-all focus:border-[#d90000] focus:ring-2 focus:ring-[#d90000]/20"
                />
              ))}
            </div>
          </div>

          {/* Verify Button */}

          <button
            onClick={handleVerifyOTP}
        
            disabled={loading}
            className="mt-10 flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#d90000] to-indigo-600 py-4 text-lg font-semibold text-white transition-all hover:scale-[1.02] hover:shadow-[0_0_35px_rgba(217,0,0,.35)]"
          >
           {loading ? "Verifying..." : "Verify OTP"}
            <ArrowRight size={20} />
          </button>

          {/* Resend */}

          <div className="mt-6 flex items-center justify-center gap-2">
            <span className="text-sm text-[#eaecf0]/60">
              Didn't receive the code?
            </span>

            <button
              onClick={handleResendOTP}
              disabled={timer > 0}
              className="flex items-center gap-2 text-sm font-semibold text-[#d90000] transition hover:text-red-400"
            >
              <RefreshCw size={16} />
              Resend OTP
            </button>
          </div>

          {/* Timer */}

          <p className="mt-3 text-center text-xs text-[#eaecf0]/50">
          Resend available in 00:{String(timer).padStart(2,"0")}
          </p>

          {/* Back */}

          <button
          onClick={()=>navigate("/login")}
           className="mt-8 flex w-full items-center justify-center gap-2 text-[#eaecf0]/60 transition hover:text-white">
            <ArrowLeft size={18} />
            Back to Signup
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
