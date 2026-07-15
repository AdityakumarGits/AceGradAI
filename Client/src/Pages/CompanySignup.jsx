import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CompanySignup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [otp, setOpt] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!fullname || !email || !password || !confirmPassword || !otp) {
      return alert("Input field are required");
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5000/api/v1/auth/signup",
        {
          fullname,
          email,
          password,
          otp,
          role:"recruiter",
        },
         );
        console.log(response.data);
     alert("Signup Successful");
    navigate("/");
     
    } catch (error) {
        console.log(error.response?.data);
  alert(error.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };
  const handleSendOtp = async () => {
  if (!email) {
    return alert("Please enter your company email first.");
  }

  try {
    const response = await axios.post(
      "http://localhost:5000/api/v1/auth/send-otp",
      { email }
    );

    alert(response.data.message);
  } catch (error) {
    alert(error.response?.data?.message || "Failed to send OTP");
  }
};

  return (
    <div className="relative h-screen overflow-hidden bg-gradient-to-br from-[#FAF7F3] via-[#F0E4D3] to-[#DCC5B2] flex items-center justify-center px-4 py-2">
      {/* Background Glow */}
      <div className="absolute -top-40 -left-40 w-[450px] h-[450px] rounded-full bg-[#D9A299]/40 blur-[140px]" />
      <div className="absolute -bottom-40 -right-40 w-[450px] h-[450px] rounded-full bg-[#DCC5B2]/60 blur-[140px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full bg-white/20 blur-[180px]" />

      {/* Signup Card */}
      <div className="relative w-full max-w-lg rounded-3xl border border-white/50 bg-white/35 backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.12)] p-6 transition-all duration-500 hover:shadow-[0_20px_100px_rgba(217,162,153,0.35)]">
        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-[#D9A299] via-[#C98772] to-[#B46A54] bg-clip-text text-transparent">
            Recruiter Signup
          </h1>

          <p className="text-gray-600 mt-1.5">
            Create your recruiter account and start hiring top talent.
          </p>
        </div>

        {/* Form */}
         <form onSubmit={handleSignup}
         className="space-y-3">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Full Name
            </label>

            <input
            required
              type="text"
              value={fullname}
              onChange={(e)=>{setFullname(e.target.value)}}
              placeholder="John Smith"
              className="w-full rounded-xl bg-white/70 border border-white/60 px-4 py-2 text-gray-700 placeholder:text-gray-400 outline-none backdrop-blur-md transition-all duration-300 focus:border-[#D9A299] focus:ring-4 focus:ring-[#D9A299]/20"
            />
          </div>

          {/* Company Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Company Email
            </label>

            <input
            required
              type="email"
              value={email}
              onChange={(e)=>{setEmail(e.target.value)}}
              placeholder="john@company.com"
              className="w-full rounded-xl bg-white/70 border border-white/60 px-4 py-2 text-gray-700 placeholder:text-gray-400 outline-none backdrop-blur-md transition-all duration-300 focus:border-[#D9A299] focus:ring-4 focus:ring-[#D9A299]/20"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Password
            </label>

            <input
            required
              type="password"
              value={password}
              onChange={(e)=>{setPassword(e.target.value)}}
              placeholder="••••••••"
              className="w-full rounded-xl bg-white/70 border border-white/60 px-4 py-2 text-gray-700 placeholder:text-gray-400 outline-none backdrop-blur-md transition-all duration-300 focus:border-[#D9A299] focus:ring-4 focus:ring-[#D9A299]/20"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Confirm Password
            </label>

            <input
            required
              type="password"
              value={confirmPassword}
              onChange={(e)=>{setconfirmPassword(e.target.value)}}
              placeholder="••••••••"
              className="w-full rounded-xl bg-white/70 border border-white/60 px-4 py-2 text-gray-700 placeholder:text-gray-400 outline-none backdrop-blur-md transition-all duration-300 focus:border-[#D9A299] focus:ring-4 focus:ring-[#D9A299]/20"
            />
          </div>

          {/* OTP */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Verify OTP
            </label>

            <div className="flex gap-3">
              <input
              required
                type="text"
                value={otp}
                onChange={(e)=>{setOpt(e.target.value)}}
                placeholder="Enter OTP"
                className="flex-1 rounded-xl bg-white/70 border border-white/60 px-4 py-2 text-gray-700 placeholder:text-gray-400 outline-none backdrop-blur-md transition-all duration-300 focus:border-[#D9A299] focus:ring-4 focus:ring-[#D9A299]/20"
              />

              <button
                type="submit"
                  onClick={handleSendOtp}
                className="rounded-xl bg-gradient-to-r from-[#D9A299] to-[#C98772] px-5 text-white font-semibold shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                Send OTP
              </button>
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Account Role
            </label>

            <select className="w-full rounded-xl bg-white/70 border border-white/60 px-4 py-2 text-gray-700 outline-none backdrop-blur-md transition-all duration-300 focus:border-[#D9A299] focus:ring-4 focus:ring-[#D9A299]/20">
              <option>Recruiter</option>
            </select>
          </div>

          {/* Signup Button */}
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-[#D9A299] via-[#C98772] to-[#B46A54] py-3 font-semibold text-white shadow-lg transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_10px_40px_rgba(217,162,153,0.45)]"
          >
            <span className="relative z-10">  {loading ? "Creating Account..." : "Create Recruiter Account"}
</span>

            <span className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-700 group-hover:translate-x-full"></span>
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?
          <button
           type="submit"
           onClick={() => navigate("/companylogin")}
           
            className="ml-2 font-semibold text-[#C98772] hover:text-[#B46A54]"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanySignup;
