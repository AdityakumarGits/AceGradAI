const CandidateSignup = () => {
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
        <form className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-[#eaecf0] mb-2 ">
              Full Name
            </label>

            <input
              type="text"
              placeholder="John Doe"
              className="w-full rounded-xl border  bg-white px-4 py-3 outline-none hover:border-[#d90000] border-2 transition"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-[#eaecf0]  mb-2">
              Email
            </label>

            <input
              type="email"
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
              type="password"
              placeholder="********"
              className="w-full rounded-xl border  bg-white px-4 py-3 outline-none hover:border-[#d90000] border-2 transition"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-[#eaecf0]  mb-2">
              Confirm Password
            </label>

            <input
              type="password"
              placeholder="********"
              className="w-full rounded-xl border  bg-white px-4 py-3 outline-none hover:border-[#d90000] border-2 transition"
            />
          </div>

          {/* Signup Button */}
          <button
            type="button"
            className="w-full rounded-xl py-3 bg-gradient-to-r from-[#d90000]  to-red-700 hover:from-red-700  hover:to-[#d90000] transition-all duration-300 font-semibold shadow-lg hover:shadow-red-500/30"
          >
            Create Account
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center text-sm text-[#eaecf0] ">
          Already have an account?
          <button
            type="button"
            className="ml-2 font-semibold text-indigo-600 hover:text-[#d90000]"
          >
            Login
          </button>
        </div>
        <div className="mt-2 text-center text-sm text-[#eaecf0]">
          Signup as Company
          <button
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





