// src/App.jsx

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
import InterviewSetup from "./Pages/InterviewSetup/InterviewSetup";
import VerifyOTP from "./Pages/VerifyOTP";
import PrivateRoute from "./context/PrivateRoute";

const App = () => {
  return (
    <Routes>

      {/* =====================================================
          LANDING
      ====================================================== */}

      <Route
        path="/"
        element={<Home />}
      />

      {/* =====================================================
          AUTH
      ====================================================== */}

      <Route
        path="/candidatesignup"
        element={<CandidateSignup />}
      />

      <Route
        path="/verifyotp"
        element={<VerifyOTP />}
      />

      <Route
        path="/candidatelogin"
        element={<CandidateLogin />}
      />

      <Route
        path="/companysignup"
        element={<CompanySignup />}
      />

      <Route
        path="/companylogin"
        element={<CompanyLogin />}
      />

      <Route
        path="/forget-password"
        element={<ForgetPassword />}
      />

      {/* =====================================================
          PROTECTED CANDIDATE ROUTES
      ====================================================== */}

      <Route element={<PrivateRoute />}>

        {/* Candidate Dashboard */}

        <Route
          path="/candidatedashboard"
          element={<CandidateDashboard />}
        />

        {/* Interview Setup */}

        <Route
          path="/interviewsetup"
          element={<InterviewSetup />}
        />

        {/* Start Interview */}

        <Route
          path="/startinterview"
          element={<StartInterview />}
        />

        {/* AI Feedback Report */}

        <Route
          path="/feedback/:interviewId"
          element={<AIFeedbackReport />}
        />

      </Route>

      {/* =====================================================
          COMPANY
      ====================================================== */}

      <Route
        path="/companydashboard"
        element={<CompanyDashboard />}
      />

      {/* =====================================================
          CONTACT
      ====================================================== */}

      <Route
        path="/contact"
        element={<Contact />}
      />

      {/* =====================================================
          404
      ====================================================== */}

      <Route
        path="*"
        element={
          <div className="flex h-screen items-center justify-center bg-[#030712] text-3xl font-bold text-white">
            404 - Page Not Found
          </div>
        }
      />

    </Routes>
  );
};

export default App;