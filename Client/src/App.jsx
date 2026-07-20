import { Routes, Route } from "react-router-dom";

import Home from "./Pages/Home";
import CandidateSignup from "./Pages/CandidateSignup";
import CandidateLogin from "./Pages/CandidateLogin";
import CompanySignup from "./Pages/CompanySignup";
import CompanyLogin from "./Pages/CompanyLogin";
import ForgetPassword from "./Pages/ForgetPassword";
import CandidateDashboard from "./Pages/candidateDashboard/CandidateDashboard";
import CompanyDashboard from "./Pages/CompanyDashboard";
import Contact from "./Pages/Contact";
import StartInterview from "./Pages/StartInterview/StartInterview";
import AIFeedbackReport from "./Pages/AiFeedbackReport.jsx/AIFeedbackReport";



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
      <Route path="/candidatedashboard" element={<CandidateDashboard/>}/>
      <Route path="/startinterview" element={<StartInterview/>}/>
      <Route path="/companydashboard" element={<CompanyDashboard />} />
      <Route path="/feedback" element={<AIFeedbackReport/>}/>
  

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