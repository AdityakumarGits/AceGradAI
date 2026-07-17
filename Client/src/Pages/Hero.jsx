import {
  ArrowRight,
  Mic,
  MessageSquareText,
  Briefcase,
} from "lucide-react";
import { Link } from "react-router-dom";
const Hero = () => {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#030712] via-[#070f2b] to-[#0f172a] px-6 pt-28 pb-8">

      {/* Background Glow */}
      <div className="absolute -left-24 top-0 h-96 w-96 rounded-full bg-[#d90000]/20 blur-[150px]" />
      <div className="absolute -right-20 bottom-0 h-[450px] w-[450px] rounded-full bg-indigo-600/20 blur-[180px]" />
      <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#070f2b] blur-[200px]" />

      

      <div className="relative z-10 mx-auto max-w-5xl text-center">

        {/* Badge */}
        <div className="inline-flex rounded-full border border-indigo-500/40 bg-[#0d1538]/70 px-6 py-2 mt-8 text-sm font-semibold text-transparent backdrop-blur-xl bg-gradient-to-r from-[#d90000] to-indigo-400 bg-clip-text">
          AI-Powered Interview Practice
        </div>

        {/* Heading */}
        <h1 className=" text-4xl font-extrabold leading-tight text-white md:text-7xl">

          Ace Your Next Interview

          <br />

          <span className="bg-gradient-to-r from-[#d90000] via-red-500 to-indigo-400 bg-clip-text text-transparent">
            with AI Mock Interviews
          </span>

        </h1>

        {/* Description */}
        <p className="mx-auto mt-3 max-w-3xl text-base leading-8 text-[#eaecf0]/80 md:text-xl">
          Practice with a realistic AI interviewer that listens,
          responds in real-time, and helps you improve with
          personalized feedback.
        </p>

        {/* Buttons */}
        <div className="mt-4 flex flex-col items-center justify-center gap-4 sm:flex-row">

          <Link to ="/interview" className="group flex items-center gap-3 rounded-xl bg-gradient-to-r from-[#d90000] to-red-700 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(217,0,0,0.4)]">

            Start Practicing Free

            <ArrowRight
              size={20}
              className="transition group-hover:translate-x-1"
            />

          </Link>

          <Link to="/features" type="submit" onClick={()=>{"/features"}} 
          className="group flex items-center gap-3 rounded-xl border border-indigo-500/40 bg-[#0d1538]/70 px-8 py-4 font-semibold text-white backdrop-blur-md transition hover:border-[#d90000]">
             
            View Features

            <ArrowRight
              size={20}
              className="transition group-hover:translate-x-1"
            />

          </Link>

        </div>

        {/* Feature Cards */}
        <div className="mt-10 grid gap-6 md:grid-cols-3">

          {/* Card 1 */}
          <div className="rounded-3xl border border-white/10 bg-[#0d1538]/75 p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-[#d90000]/50 hover:shadow-[0_0_40px_rgba(217,0,0,0.25)]">

            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-[#d90000]/30 bg-[#d90000]/10">

              <Mic
                size={30}
                className="text-[#d90000]"
              />

            </div>

            <h3 className="mt-5 text-xl font-semibold text-white">
              Real-time Voice AI
            </h3>

            <div className="mx-auto mt-4 h-1 w-12 rounded-full bg-[#d90000]" />

          </div>

          {/* Card 2 */}
          <div className="rounded-3xl border border-white/10 bg-[#0d1538]/75 p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-indigo-400 hover:shadow-[0_0_40px_rgba(99,102,241,0.25)]">

            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-indigo-500/30 bg-indigo-500/10">

              <MessageSquareText
                size={30}
                className="text-indigo-400"
              />

            </div>

            <h3 className="mt-5 text-xl font-semibold text-white">
              Instant Feedback
            </h3>

            <div className="mx-auto mt-4 h-1 w-12 rounded-full bg-indigo-400" />

          </div>

          {/* Card 3 */}
          <div className="rounded-3xl border border-white/10 bg-[#0d1538]/75 p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-indigo-400 hover:shadow-[0_0_40px_rgba(99,102,241,0.25)]">

            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-indigo-500/30 bg-indigo-500/10">

              <Briefcase
                size={30}
                className="text-indigo-400"
              />

            </div>

            <h3 className="mt-5 text-xl font-semibold text-white">
              10+ Interview Types
            </h3>

            <div className="mx-auto mt-4 h-1 w-12 rounded-full bg-indigo-400" />

          </div>

        </div>

      </div>
    </section>
  );
};

export default Hero;