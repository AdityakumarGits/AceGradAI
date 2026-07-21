import { Link,  useNavigate } from "react-router-dom";


const Navbar = () => {
  const navigate=useNavigate()
  return (
    <nav className="fixed top-0 left-0 z-50 w-full px-6 py-5">
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-white/10 bg-[#0d1538]/70 backdrop-blur-2xl px-8 py-4 shadow-[0_10px_40px_rgba(0,0,0,0.45)]">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-4 group">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#d90000] to-red-700 text-xl font-bold text-white shadow-[0_0_25px_rgba(217,0,0,0.45)] transition duration-300 group-hover:scale-110">
            A
          </div>

          <div >
            <h1 className="text-2xl font-bold cursor-pointer text-white">
              AceGrad
              <span className="bg-gradient-to-r from-[#d90000] to-indigo-400 bg-clip-text text-transparent">
                AI
              </span>
            </h1>

            <p className="text-xs tracking-widest text-gray-400 uppercase">
              AI Interview Platform
            </p>
          </div>
        </Link>

        {/* Navigation */}
        <div className="hidden md:flex items-center gap-8 text-[15px]">
          {[
            { name: "Features", id: "features" },
            { name: "How It Works", id: "how-it-works" },
            { name: "Pricing", id: "pricing" },
            { name: "FAQ", id: "faq" },
          ].map((item) => (
            <a
              key={item.name}
              href={`#${item.id}`}
              className="group relative text-[#eaecf0]/80 transition duration-300 hover:text-white"
            >
              {item.name}

              <span className="absolute -bottom-2 left-0 h-[2px] w-0 rounded-full bg-gradient-to-r from-[#d90000] to-indigo-400 transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-4">
          <Link
            to="/candidatelogin"
            className="hidden md:block rounded-xl border border-indigo-500/30 bg-[#0d1538]/60 px-5 py-2.5 font-medium text-[#eaecf0] transition-all duration-300 hover:border-[#d90000] hover:bg-[#121d47]"
          >
            Candidate Login
          </Link>

          <Link
            to="/companylogin"
            className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-[#d90000] to-red-700 px-6 py-2.5 font-semibold text-white shadow-lg transition duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(217,0,0,0.45)]"
          >
            <span className="relative z-10">Corporate Login</span>

            <span className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-700 group-hover:translate-x-full"></span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
