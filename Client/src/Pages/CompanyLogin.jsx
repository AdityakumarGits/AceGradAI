const CompanyLogin = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#FAF7F3] via-[#F0E4D3] to-[#DCC5B2] flex items-center justify-center p-6">
      {/* Background Glow */}
      <div className="absolute -top-40 -left-40 w-[450px] h-[450px] rounded-full bg-[#D9A299]/40 blur-[140px]" />

      <div className="absolute -bottom-40 -right-40 w-[450px] h-[450px] rounded-full bg-[#DCC5B2]/60 blur-[140px]" />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full bg-white/20 blur-[180px]" />

      {/* Login Card */}
      <div className="relative w-full max-w-md rounded-3xl border border-white/50 bg-white/35 backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.12)] p-8 transition-all duration-500 hover:shadow-[0_20px_100px_rgba(217,162,153,0.35)]">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-[#D9A299] via-[#C98772] to-[#B46A54] bg-clip-text text-transparent">
            Recruiter Login
          </h1>

          <p className="mt-3 text-gray-600">
            Welcome back! Sign in to continue.
          </p>
        </div>

        {/* Login Form */}
        <form className="space-y-5">

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Company Email
            </label>

            <input
              type="email"
              placeholder="john@company.com"
              className="w-full rounded-xl bg-white/70 border border-white/60 px-4 py-3 text-gray-700 placeholder:text-gray-400 outline-none backdrop-blur-md transition-all duration-300 focus:border-[#D9A299] focus:ring-4 focus:ring-[#D9A299]/20"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>

            <input
              type="password"
              placeholder="••••••••"
              className="w-full rounded-xl bg-white/70 border border-white/60 px-4 py-3 text-gray-700 placeholder:text-gray-400 outline-none backdrop-blur-md transition-all duration-300 focus:border-[#D9A299] focus:ring-4 focus:ring-[#D9A299]/20"
            />
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end">
            <button
              type="button"
              className="text-sm font-medium text-[#C98772] hover:text-[#B46A54]"
            >
              Forgot Password?
            </button>
          </div>

          {/* Login Button */}
          <button
            type="button"
            className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-[#D9A299] via-[#C98772] to-[#B46A54] py-3 font-semibold text-white shadow-lg transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_10px_40px_rgba(217,162,153,0.45)]"
          >
            <span className="relative z-10">
              Login
            </span>

            <span className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-700 group-hover:translate-x-full"></span>
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?
          <button
            type="button"
            className="ml-2 font-semibold text-[#C98772] hover:text-[#B46A54]"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyLogin;