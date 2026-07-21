import { Check, Sparkles, Crown, Rocket } from "lucide-react";

const plans = [
  {
    icon: Sparkles,
    name: "Starter",
    price: "Free",
    description: "Perfect for students trying AI interviews.",
    color: "from-[#d90000] to-red-700",
    button: "Get Started",
    popular: false,
    features: [
      "3 AI Mock Interviews / Month",
      "Basic AI Feedback",
      "Voice-to-Text Support",
      "HR Interview Practice",
      "Email Support",
    ],
  },

  {
    icon: Crown,
    name: "Professional",
    price: "₹499",
    duration: "/month",
    description: "Best for job seekers preparing seriously.",
    color: "from-indigo-500 to-[#d90000]",
    button: "Start Pro",
    popular: true,
    features: [
      "Unlimited AI Interviews",
      "Technical + HR Interviews",
      "Advanced AI Feedback",
      "Performance Analytics",
      "Resume Analysis",
      "Priority Support",
    ],
  },

  {
    icon: Rocket,
    name: "Enterprise",
    price: "Custom",
    description: "Designed for recruiters & organizations.",
    color: "from-[#d90000] to-indigo-500",
    button: "Contact Sales",
    popular: false,
    features: [
      "Unlimited Candidates",
      "Recruiter Dashboard",
      "Custom Assessments",
      "Candidate Analytics",
      "Hiring Pipeline",
      "Dedicated Support",
    ],
  },
];

const Pricing = () => {
  return (
    <section
      id="pricing"
      className="relative overflow-hidden bg-gradient-to-br from-[#030712] via-[#070f2b] to-[#0f172a] py-28 px-6"
    >
      {/* Background Glow */}
      <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-[#d90000]/20 blur-[170px]" />
      <div className="absolute bottom-0 right-0 h-[450px] w-[450px] rounded-full bg-indigo-600/20 blur-[180px]" />

      <div className="relative mx-auto max-w-7xl">
        {/* Heading */}
        <div className="text-center">
          <p className="font-semibold uppercase tracking-[4px] text-[#d90000]">
            Pricing
          </p>

          <h2 className="mt-4 text-4xl font-bold text-white md:text-5xl">
            Choose Your
            <span className="bg-gradient-to-r from-[#d90000] to-indigo-400 bg-clip-text text-transparent">
              {" "}
              Perfect Plan
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg text-[#eaecf0]/70">
            Start for free and upgrade anytime. Select the plan that fits your
            interview preparation or hiring needs.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-20 grid gap-8 lg:grid-cols-3">
          {plans.map((plan, index) => {
            const Icon = plan.icon;

            return (
              <div
                key={index}
                className={`relative rounded-3xl border ${
                  plan.popular ? "border-[#d90000]" : "border-white/10"
                } bg-[#0d1538]/80 backdrop-blur-xl p-8 transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_0_45px_rgba(217,0,0,0.25)]`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#d90000] to-indigo-500 px-5 py-2 text-sm font-semibold text-white shadow-lg">
                    Most Popular
                  </div>
                )}

                {/* Icon */}

                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${plan.color}`}
                >
                  <Icon size={30} className="text-white" />
                </div>

                <h3 className="mt-6 text-2xl font-bold text-white">
                  {plan.name}
                </h3>

                <p className="mt-3 text-[#eaecf0]/70">{plan.description}</p>

                <div className="mt-6">
                  <span className="text-5xl font-bold text-white">
                    {plan.price}
                  </span>

                  <span className="text-[#eaecf0]/60">{plan.duration}</span>
                </div>

                {/* Features */}

                <div className="mt-8 space-y-4">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Check size={18} className="text-[#d90000]" />

                      <span className="text-[#eaecf0]/80">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  className={`mt-10 w-full rounded-xl bg-gradient-to-r ${plan.color} py-3 font-semibold text-white transition-all duration-300 hover:scale-105`}
                >
                  {plan.button}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
