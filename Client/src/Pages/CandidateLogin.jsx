//import { Mail, Lock } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { candidateToast } from "../utils/toast";
const CandidateLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgetPassword,setforgetPassword]=useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return alert("input field are required");
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5000/api/v1/auth/login",
        {
          email,
          password,
        },
      );
      const token = response.data?.token;
      const user = response.data?.data?.user;
     console.log("User:", user);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      console.log("Login Response:", response.data);
      candidateToast.success("Login Successful");
      navigate("/");
    } catch (error) {
      console.log(error);
      candidateToast.error(error.response?.data?.message || "login failed");
    } finally {
      setLoading(false);
    }
  };
  const handleForgotPassword = async () => {
  if (!email) {
    return candidateToast.error("Please enter your email address first.");
  }

  try {
    setLoading(true);

    const response = await axios.post(
      "http://localhost:5000/api/v1/auth/forgot-password",
      {
        email,
      }
    );

    candidateToast.error(response.data.message || "Password reset link sent to your email.");
  } catch (error) {
    console.error(error);
    candidateToast.error(error.response?.data?.message || "Failed to send reset link.");
  } finally {
    setLoading(false);
  }
};

  return (
    //  <div className="min-h-screen  bg-[#070f2b] flex items-center justify-center p-6">
    <div className="relative h-screen overflow-hidden bg-gradient-to-br from-[#030712] via-[#070f2b] to-[#0f172a] flex items-center justify-center p-6">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#d90000]/20 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[180px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#070f2b] rounded-full blur-[200px]" />

      {/* Login Card */}
      <div className="relative w-full max-w-md rounded-3xl bg-[#0d1538]/90 backdrop-blur-xl shadow-2xl border border-white/10 p-8 shadow-[0_0_50px_rgba(0,0,0,0.6)]">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-indigo-400 bg-clip-text text-transparent">
            Login as Candidate
          </h1>
          <p className="text-[#eaecf0] mt-2">Log in to get started</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-[#eaecf0]  mb-2">
              Email
            </label>

            <input
            required
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              placeholder="example@email.com"
              className="w-full rounded-xl border  bg-white px-4 py-3 outline-none hover:border-[#d90000] border-2 transition"
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
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              placeholder="********"
              className="w-full rounded-xl border  bg-white px-4 py-3 outline-none hover:border-[#d90000] border-2 transition"
            />
          </div>
          <div className="flex justify-end">
            <button onClick={handleForgotPassword}
              type="submit"
              onClick={()=>{navigate("/forget-password")}}
              className="text-sm text-indigo-400 hover:text-red-500 transition"
            >
              Forgot Password?
            </button>
          </div>

          {/* login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl py-3 bg-gradient-to-r from-[#d90000]  to-red-700 hover:from-red-700  hover:to-[#d90000] transition-all duration-300 font-semibold shadow-lg hover:shadow-red-500/30"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center text-sm text-[#eaecf0] ">
          Don't have an account?
          <button
            onClick={() => navigate("/candidatesignup")}
            type="button"
            className="ml-2 font-semibold text-indigo-600 hover:text-[#d90000]"
          >
            Signup
          </button>
        </div>
        <div className="mt-2 text-center text-sm text-[#eaecf0]">
          Login as Company
          <button
            onClick={() => navigate("/companylogin")}
            type="button"
            className="ml-2 font-semibold  text-indigo-600 hover:text-[#d90000]"
          >
            login
          </button>
        </div>
      </div>
    </div>
  );
};

export default CandidateLogin;
