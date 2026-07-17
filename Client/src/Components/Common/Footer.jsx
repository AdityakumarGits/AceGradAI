

import{ Mail, Phone, } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-[#030712] via-[#070f2b] to-[#0f172a] border-t border-white/10">

      {/* Background Glow */}
      <div className="absolute left-0 bottom-0 h-80 w-80 rounded-full bg-[#d90000]/20 blur-[150px]" />
      <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-indigo-600/20 blur-[170px]" />

      <div className="relative mx-auto max-w-7xl px-6 py-16">

        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

          {/* Company */}
          <div>

            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#d90000] to-red-700 text-xl font-bold text-white shadow-lg">
                A
              </div>

              <div>

                <h2 className="text-2xl font-bold text-white">
                  AceGrad
                  <span className="bg-gradient-to-r from-[#d90000] to-indigo-400 bg-clip-text text-transparent">
                    AI
                  </span>
                </h2>

                <p className="text-xs text-gray-400">
                  AI Career Platform
                </p>

              </div>

            </div>

            <p className="mt-6 leading-7 text-[#eaecf0]/70">
              AceGrad helps students and professionals prepare for
              interviews through realistic AI-powered mock interviews,
              instant feedback, and personalized improvement reports.
            </p>

          </div>

          {/* Quick Links */}
          <div>

            <h3 className="mb-5 text-xl font-semibold text-white">
              Quick Links
            </h3>

            <ul className="space-y-3">

              {[
                "Home",
                "Features",
                "How It Works",
                "Pricing",
                "FAQ",
              ].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-[#eaecf0]/70 transition hover:text-[#d90000]"
                  >
                    {item}
                  </a>
                </li>
              ))}

            </ul>

          </div>

          {/* Resources */}
          <div>

            <h3 className="mb-5 text-xl font-semibold text-white">
              Resources
            </h3>

            <ul className="space-y-3">

              <li>
                <a
                  href="#"
                  className="text-[#eaecf0]/70 hover:text-indigo-400 transition"
                >
                  Blog
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="text-[#eaecf0]/70 hover:text-indigo-400 transition"
                >
                  Interview Tips
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="text-[#eaecf0]/70 hover:text-indigo-400 transition"
                >
                  Privacy Policy
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="text-[#eaecf0]/70 hover:text-indigo-400 transition"
                >
                  Terms & Conditions
                </a>
              </li>

            </ul>

          </div>

          {/* Contact */}
          <div>

            <h3 className="mb-5 text-xl font-semibold text-white">
              Contact Us
            </h3>

            <div className="space-y-4">

              <div className="flex items-center gap-3 text-[#eaecf0]/70">

                <Mail className="text-[#d90000]" size={18} />

                support@acegradai.com

              </div>

              <div className="flex items-center gap-3 text-[#eaecf0]/70">

                <Phone className="text-[#d90000]" size={18} />

                +91 98765 43210

              </div>

              <div className="flex items-center gap-3 text-[#eaecf0]/70">

                {/* <MapPin className="text-[#d90000]" size={18} /> */}

                India

              </div>

            </div>

            {/* Social Icons */}

            {/* <div className="mt-8 flex gap-4">

              {[Github, Linkedin, Instagram].map((Icon, index) => (

                <a
                  key={index}
                  href="#"
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-[#0d1538]/80 text-[#eaecf0] transition-all duration-300 hover:border-[#d90000] hover:bg-[#d90000] hover:text-white hover:shadow-[0_0_20px_rgba(217,0,0,0.4)]"
                >
                  <Icon size={20} />
                </a>

              ))}

            </div> */}

          </div>

        </div>

        {/* Divider */}

        <div className="my-10 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        {/* Bottom */}

        <div className="flex flex-col items-center justify-between gap-4 text-center text-sm text-[#eaecf0]/60 md:flex-row">

          <p>
            © {new Date().getFullYear()} AceGrad AI. All Rights Reserved.
          </p>

          <p>
            Built with ❤️ using React & Tailwind CSS
          </p>

        </div>

      </div>
    </footer>
  );
};

export default Footer;
