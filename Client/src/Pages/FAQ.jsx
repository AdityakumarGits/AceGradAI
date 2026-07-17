import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "How does AceGrad work?",
    answer:
      "AceGrad uses advanced AI to simulate realistic interview experiences. You answer questions using your voice, and the AI evaluates your communication skills, confidence, technical knowledge, and overall performance while providing personalized feedback.",
  },
  {
    question: "Is AceGrad free to try?",
    answer:
      "Yes. AceGrad offers a free plan that lets you experience AI-powered mock interviews before upgrading to premium features.",
  },
  {
    question: "What types of interviews can I practice?",
    answer:
      "You can practice HR interviews, Technical interviews, Behavioral interviews, System Design interviews, Campus Placements, Aptitude discussions, and Company-specific interview rounds.",
  },
  {
    question: "How is AceGrad different from practicing with a friend?",
    answer:
      "Unlike practicing with a friend, AceGrad provides unbiased AI feedback, instant scoring, unlimited practice sessions, and adapts questions based on your responses.",
  },
  {
    question: "Can AceGrad help with technical interviews?",
    answer:
      "Absolutely. AceGrad supports technical interview preparation with coding concepts, DSA discussions, project-based questions, system design, and role-specific interview practice.",
  },
  {
    question: "How does the AI scoring work?",
    answer:
      "The AI evaluates your communication, confidence, fluency, response quality, vocabulary, technical accuracy, and overall interview performance to generate a detailed report.",
  },
  {
    question: "Is my data private and secure?",
    answer:
      "Yes. Your interview recordings, responses, and personal information are encrypted and securely stored. Your data is never shared without your permission.",
  },
  {
    question: "How many sessions do I need to see improvement?",
    answer:
      "Most users notice significant improvement after 5–10 mock interviews. Consistent practice combined with AI feedback leads to better confidence and interview performance.",
  },
];

const FAQ = () => {
  const [active, setActive] = useState(null);

  const toggle = (index) => {
    setActive(active === index ? null : index);
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#030712] via-[#070f2b] to-[#0f172a] px-6 py-28">

      {/* Background Glow */}
      <div className="absolute top-0 left-0 h-96 w-96 rounded-full bg-[#d90000]/20 blur-[160px]" />
      <div className="absolute bottom-0 right-0 h-[450px] w-[450px] rounded-full bg-indigo-600/20 blur-[180px]" />

      <div className="relative mx-auto max-w-4xl">

        {/* Heading */}

        <div className="text-center mb-14">

          <p className="text-[#d90000] font-semibold uppercase tracking-widest">
            Support
          </p>

          <h2 className="mt-3 text-4xl md:text-5xl font-bold text-white">
            Frequently Asked
            <span className="bg-gradient-to-r from-[#d90000] to-indigo-400 bg-clip-text text-transparent">
              {" "}Questions
            </span>
          </h2>

          <p className="mt-4 text-[#eaecf0]/70">
            Everything you need to know about AceGrad AI Interview Platform.
          </p>

        </div>

        {/* FAQ */}

        <div className="space-y-5">

          {faqs.map((faq, index) => (

            <div
              key={index}
              className="rounded-2xl border border-white/10 bg-[#0d1538]/80 backdrop-blur-xl overflow-hidden transition-all duration-300 hover:border-[#d90000]/40"
            >

              <button
                onClick={() => toggle(index)}
                className="flex w-full items-center justify-between px-7 py-6 text-left"
              >

                <h3 className="text-lg md:text-xl font-semibold text-white">
                  {faq.question}
                </h3>

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10">

                  {active === index ? (
                    <Minus className="text-[#d90000]" size={20} />
                  ) : (
                    <Plus className="text-indigo-400" size={20} />
                  )}

                </div>

              </button>

              <div
                className={`grid transition-all duration-500 ease-in-out ${
                  active === index
                    ? "grid-rows-[1fr]"
                    : "grid-rows-[0fr]"
                }`}
              >

                <div className="overflow-hidden">

                  <p className="px-7 pb-6 text-[#eaecf0]/80 leading-8">
                    {faq.answer}
                  </p>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>
    </section>
  );
};

export default FAQ;