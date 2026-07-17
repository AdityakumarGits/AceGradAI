import {
  Users,
  BrainCircuit,
  Mic,
  BarChart4,
  Building2,
  ShieldCheck
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Role-Based Dynamic Portals",
    description:
      "Dedicated dashboards for Candidates and Recruiters with personalized workflows, ensuring a smooth and customized experience for job seekers and hiring teams.",
    color: "from-[#d90000] to-red-700",
  },
  {
    icon: BrainCircuit,
    title: "AI-Powered Live Interview Sandbox",
    description:
      "Practice interviews inside a realistic AI-powered environment with dynamic question generation, adaptive conversations, and real-time performance tracking.",
    color: "from-indigo-500 to-indigo-700",
  },
  {
    icon: Mic,
    title: "Real-Time Voice Transcriber",
    description:
      "Built-in Speech-to-Text technology instantly converts your spoken answers into highly accurate text while maintaining speed and precision.",
    color: "from-[#d90000] to-indigo-500",
  },
  {
    icon: BarChart4,
    title: "Deep AI Performance Hub",
    description:
      "Receive detailed interview analytics including communication clarity, technical accuracy, confidence score, and personalized improvement suggestions.",
    color: "from-indigo-500 to-[#d90000]",
  },
  {
    icon: Building2,
    title: "Enterprise Assessment Suite",
    description:
      "Recruiters can create hiring campaigns, configure custom screening rules, evaluate candidates, and monitor recruitment analytics from one dashboard.",
    color: "from-[#d90000] to-red-700",
  },
  {
  icon: ShieldCheck,
  title: "Automated Screening & Fitment Scoring",
  description:
    "An advanced ranking system automatically evaluates candidates against custom job requirements, providing recruiters with an instant AI-powered fitment score.",
  color: "from-indigo-500 to-[#d90000]",
},
];

const Features = () => {
  return (
    <section
      id="features"
      className="relative overflow-hidden bg-gradient-to-br from-[#030712] via-[#070f2b] to-[#0f172a] py-28 px-6"
    >
      {/* Background Glow */}

      <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-[#d90000]/20 blur-[170px]" />

      <div className="absolute bottom-0 right-0 h-[450px] w-[450px] rounded-full bg-indigo-600/20 blur-[180px]" />

      <div className="relative mx-auto max-w-7xl">

        {/* Heading */}

        <div className="text-center">

          <p className="uppercase tracking-[4px] text-[#d90000] font-semibold">
            Powerful Features
          </p>

          <h2 className="mt-4 text-4xl md:text-5xl font-bold text-white">
            Everything You Need for
            <span className="bg-gradient-to-r from-[#d90000] to-indigo-400 bg-clip-text text-transparent">
              {" "}Interview Success
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg text-[#eaecf0]/70">
            AceGrad AI combines intelligent interview simulations,
            recruiter tools, and detailed AI analytics into one
            powerful hiring ecosystem.
          </p>

        </div>

        {/* Cards */}

        <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          {features.map((feature, index) => {

            const Icon = feature.icon;

            return (

              <div
                key={index}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#0d1538]/80 p-8 backdrop-blur-xl transition-all duration-500 hover:-translate-y-3 hover:border-[#d90000]/50 hover:shadow-[0_0_45px_rgba(217,0,0,0.25)]"
              >

                {/* Gradient Glow */}

                <div className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">

                  <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-[#d90000]/20 blur-3xl" />

                </div>

                {/* Icon */}

                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.color} shadow-lg`}
                >

                  <Icon className="text-white" size={30} />

                </div>

                {/* Title */}

                <h3 className="mt-7 text-2xl font-bold text-white">
                  {feature.title}
                </h3>

                {/* Description */}

                <p className="mt-5 leading-8 text-[#eaecf0]/70">
                  {feature.description}
                </p>

                {/* Bottom Line */}

                <div className="mt-8 h-1 w-14 rounded-full bg-gradient-to-r from-[#d90000] to-indigo-500 transition-all duration-500 group-hover:w-full"></div>

              </div>

            );

          })}

        </div>

      </div>
    </section>
  );
};

export default Features;