import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const CandidateSignup = () => {
  const navigate=useNavigate();
  const [fullname,setFullname]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [confirmPassword,setconfirmPassword]=useState("");
  const [loading,setLoading]=useState(false);
 // const [showPassword,setShowPassowrd]=useState(false);

  const handleSignup=async (e)=>{
      e.preventDefault();

  if(!fullname || !email || !password || !confirmPassword){
     alert("please fill all fields");
     return ;
  }
if (password !== confirmPassword) {
  alert("Passwords do not match");
  return;
}
try {
  setLoading(true);
   const response=await axios.post("http://localhost:5000/api/v1/auth/signup",
    {fullname,email,password,role: "candidate"}) 
     console.log(response.data);
     alert("Signup Successful");

navigate("/candidatelogin");
     
} catch (error) {
  console.log(error.response?.data);
  alert(error.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
}
  }
  return (
    //  <div className="min-h-screen  bg-[#070f2b] flex items-center justify-center p-6">
    <div className="relative h-screen overflow-hidden bg-gradient-to-br from-[#030712] via-[#070f2b] to-[#0f172a] flex items-center justify-center p-6">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#d90000]/20 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[180px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#070f2b] rounded-full blur-[200px]" />

      {/* Signup Card */}
      <div className="relative w-full max-w-md rounded-3xl bg-[#0d1538]/90 backdrop-blur-xl shadow-2xl border border-white/10 p-8 shadow-[0_0_50px_rgba(0,0,0,0.6)]">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-indigo-400 bg-clip-text text-transparent">Create Account</h1>
          <p className="text-[#eaecf0] mt-2">Sign up to get started</p>
        </div>

        {/* Form */}
        <form 
        className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-[#eaecf0] mb-2 ">
              Full Name
            </label>

            <input
            required
              type="text"
              placeholder="John Doe"
              value={fullname}
               onChange={(e) => setFullname(e.target.value)}
              className="w-full rounded-xl border  bg-gray-300 px-4 py-3 outline-none hover:border-[#d90000] border-2 transition"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-[#eaecf0]  mb-2">
              Email
            </label>

            <input
            required
              type="email"
              value={email}
              placeholder="example@email.com"
               onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border  bg-gray-300  px-4 py-3 outline-none hover:border-[#d90000] border-2 transition"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-[#eaecf0]  mb-2">
              Password
            </label>

            <input
            required
              type="password"
              value={password}
               onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              className="w-full rounded-xl border  bg-gray-300  px-4 py-3 outline-none hover:border-[#d90000] border-2 transition"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-[#eaecf0]  mb-2">
              Confirm Password
            </label>

            <input
            required
              type="password"
              value={confirmPassword}
               onChange={(e) => setconfirmPassword(e.target.value)}
              placeholder="********"
              className="w-full rounded-xl border  bg-gray-300  px-4 py-3 outline-none hover:border-[#d90000] border-2 transition"
            />
          </div>

          {/* Signup Button */}
          <button
            type="submit"
            onClick={handleSignup}
              disabled={loading}
            className="w-full rounded-xl py-3 bg-gradient-to-r from-[#d90000]  to-red-700 hover:from-red-700  hover:to-[#d90000] transition-all duration-300 font-semibold shadow-lg hover:shadow-red-500/30"
            
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center text-sm text-[#eaecf0] ">
          Already have an account?
            <button onClick={() => navigate("/candidatelogin")}
            type="button"
            className="ml-2 font-semibold text-indigo-600 hover:text-[#d90000]"
          >
            Login
          </button>
        </div>
        <div className="mt-2 text-center text-sm text-[#eaecf0]">
          Signup as Company
          <button onClick={() => navigate("/companySignup")}
            type="button"
            className="ml-2 font-semibold text-indigo-600 hover:text-[#d90000]"
          >
            Signup
          </button>
        </div>
      </div>
    </div>
  );
};

export default CandidateSignup;





