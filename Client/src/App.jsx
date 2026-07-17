import { Routes, Route } from "react-router-dom";

import Home from "./Pages/Home";
import CandidateSignup from "./Pages/CandidateSignup";
import CandidateLogin from "./Pages/CandidateLogin";
import CompanySignup from "./Pages/CompanySignup";
import CompanyLogin from "./Pages/CompanyLogin";
import ForgetPassword from "./Pages/ForgetPassword";
import { CandidateDashboard } from "./Pages/CandidateDashboard";
import CompanyDashboard from "./Pages/CompanyDashboard";
import Analytics from "./Pages/Analytics";
import Contact from "./Pages/Contact";
import Interview from "./Pages/Interview";
//import Features from "./Pages/Features";

const App = () => {
  return (
    <Routes>

      {/* Landing Page */}
      <Route path="/" element={<Home />} />

      {/* Auth */}
      <Route path="/candidatesignup" element={<CandidateSignup />} />
      <Route path="/candidatelogin" element={<CandidateLogin />} />
      <Route path="/companysignup" element={<CompanySignup />} />
      <Route path="/companylogin" element={<CompanyLogin />} />
      <Route path="/forget-password" element={<ForgetPassword />} />

      {/* Dashboard */}
      <Route path="/candidatedashboard" element={<CandidateDashboard />} />
      <Route path="/companydashboard" element={<CompanyDashboard />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/interview" element={<Interview/>}/> 
      {/* <Route path="/features" element={<Features />}/> */}

      {/* Contact Page */}
      <Route path="/contact" element={<Contact />} />

      {/* 404 */}
      <Route
        path="*"
        element={
          <div className="flex h-screen items-center justify-center text-3xl font-bold">
            404 - Page Not Found
          </div>
        }
      />
    </Routes>
  );
};

export default App;