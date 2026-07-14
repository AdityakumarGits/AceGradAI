import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import CandidateSignup from "./Pages/CandidateSignup";
import CandidateLogin from "./Pages/CandidateLogin";
import CompanySignup from "./Pages/CompanySignup";
import CompanyLogin from "./Pages/CompanyLogin";
import { CandidateDashboard } from "./Pages/CandidateDashboard";
import CompanyDashboard from "./Pages/CompanyDashboard";
import Analytics from "./Pages/Analytics";
import Navbar from "./Components/common/Navbar";
import Footer from "./Components/common/Footer";
import Contact from "./Pages/Contact";
const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/navbar" element={<Navbar />} />
        <Route path="/footer" element={<Footer />} />

        <Route path="/candidatesignup" element={<CandidateSignup />} />
        <Route path="/candidatelogin" element={<CandidateLogin />} />
        <Route path="/companysignup" element={<CompanySignup />} />
        <Route path="/companylogin" element={<CompanyLogin />} />
        <Route path="/candidatedashboard" element={<CandidateDashboard />} />
        <Route path="/companydashboard" element={<CompanyDashboard />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/contact" element={<Contact />} />
        {/* Fallback route */}
        <Route
          path="*"
          element={
            <div className="flex items-center justify-center h-screen font-bold text-2xl">
              404 - Page Not Found
            </div>
          }
        />
      </Routes>
    </>
  );
};

export default App;
