import {
  UserPlus,
  Mic,
  BrainCircuit,
  BarChart3,
} from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Create Your Account",
    description:
      "Sign up in seconds and choose your interview category, experience level, and preferred job role.",
  },
  {
    icon: Mic,
    title: "Start AI Interview",
    description:
      "Talk with our intelligent AI interviewer through realistic voice conversations just like a real interview.",
  },
  {
    icon: BrainCircuit,
    title: "AI Evaluates You",
    description:
      "Our AI analyzes your communication, confidence, technical knowledge, fluency, and response quality in real time.",
  },
  {
    icon: BarChart3,
    title: "Get Detailed Feedback",
    description:
      "Receive instant scores, personalized suggestions, strengths, weaknesses, and improvement tips after every interview.",
  },
];

const HowItWorks = () => {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden bg-gradient-to-br from-[#030712] via-[#070f2b] to-[#0f172a] py-28 px-6"
    >
      {/* Background Glow */}
      <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-[#d90000]/20 blur-[170px]" />
      <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-indigo-600/20 blur-[180px]" />

      <div className="relative mx-auto max-w-7xl">

        {/* Heading */}

        <div className="text-center">

          <p className="font-semibold uppercase tracking-[4px] text-[#d90000]">
            Process
          </p>

          <h2 className="mt-4 text-4xl font-bold text-white md:text-5xl">
            How It
            <span className="bg-gradient-to-r from-[#d90000] to-indigo-400 bg-clip-text text-transparent">
              {" "}Works
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-[#eaecf0]/70">
            Practice interviews in four simple steps and receive
            AI-powered insights to improve every session.
          </p>

        </div>

        {/* Timeline */}

        <div className="relative mt-20">

          {/* Center Line */}

          <div className="absolute left-1/2 hidden h-full w-[2px] -translate-x-1/2 bg-gradient-to-b from-[#d90000] via-indigo-500 to-[#d90000] lg:block" />

          <div className="space-y-14">

            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <div
                  key={index}
                  className={`flex items-center ${
                    index % 2 === 0
                      ? "lg:flex-row"
                      : "lg:flex-row-reverse"
                  } flex-col gap-8`}
                >
                  {/* Card */}

                  <div className="w-full lg:w-5/12">

                    <div className="rounded-3xl border border-white/10 bg-[#0d1538]/80 p-8 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-[#d90000]/50 hover:shadow-[0_0_35px_rgba(217,0,0,0.25)]">

                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#d90000] to-red-700 shadow-lg">

                        <Icon className="text-white" size={30} />

                      </div>

                      <div className="mt-6">

                        <span className="text-sm font-semibold text-indigo-400">
                          STEP {index + 1}
                        </span>

                        <h3 className="mt-2 text-2xl font-bold text-white">
                          {step.title}
                        </h3>

                        <p className="mt-4 leading-7 text-[#eaecf0]/70">
                          {step.description}
                        </p>

                      </div>

                    </div>

                  </div>

                  {/* Timeline Circle */}

                  <div className="hidden lg:flex h-14 w-14 items-center justify-center rounded-full border-4 border-[#070f2b] bg-gradient-to-br from-[#d90000] to-indigo-500 shadow-[0_0_25px_rgba(217,0,0,0.4)]">

                    <span className="font-bold text-white">
                      {index + 1}
                    </span>

                  </div>

                  {/* Empty Space */}

                  <div className="hidden lg:block w-5/12"></div>

                </div>
              );
            })}

          </div>

        </div>

      </div>
    </section>
  );
};

export default HowItWorks;