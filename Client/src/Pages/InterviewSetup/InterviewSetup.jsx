import { useState } from "react";
import { Wifi } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useInternetCheck } from "./hooks/useInternetCheck";
import { useCameraStream } from "./hooks/useCameraStream";
import ChecklistItem from "./components/ChecklistItem";
import MicTestStep from "./components/MicTestSetup";
import CameraPreview from "./components/CameraPreview";
import { useNavigate, useLocation } from "react-router-dom";

export default function InterviewSetup() {
  const navigate = useNavigate();
  const location = useLocation();

  // Receive complete configuration from InterviewConfig
  const interviewConfig = location.state || {};

  const {
    questionsSources,
    jobTitle,
    jobDescription,
    topics,
    resumeFile,
    experienceLevel,
  } = interviewConfig;

  const { user } = useAuth();

  const internetOk = useInternetCheck();

  const {
    videoRef,
    cameraOk,
    stream,
  } = useCameraStream();

  const [micOk, setMicOk] = useState(false);
  const [loading, setLoading] = useState(false);

  // -----------------------------------------
  // ALL SYSTEM CHECKS
  // -----------------------------------------

  const allChecksPassed =
    internetOk &&
    cameraOk &&
    micOk;

  // -----------------------------------------
  // VALIDATE INTERVIEW CONFIG
  // -----------------------------------------

  const isInterviewConfigValid = () => {
    // JD
    if (questionsSources === "jd") {
      return (
        Boolean(jobTitle?.trim()) &&
        Boolean(jobDescription?.trim())
      );
    }

    // Topics
   if (questionsSources === "topics") {
  return (
    Array.isArray(topics) &&
    topics.length > 0 &&
    ["fresher", "junior", "mid", "senior"].includes(experienceLevel)
  );
}

    // Resume
    if (questionsSources === "resume") {
      return Boolean(resumeFile);
    }

    return false;
  };

  // -----------------------------------------
  // START INTERVIEW
  // -----------------------------------------

  const handleStartInterview = () => {
    if (loading) return;

    if (!isInterviewConfigValid()) {
      console.error(
        "Invalid interview configuration:",
        interviewConfig
      );

      return;
    }

    if (!allChecksPassed) {
      return;
    }

    setLoading(true);

    /*
      IMPORTANT:

      InterviewSetup does NOT call /startInterview.

      It only forwards the configuration to
      StartInterview.

      StartInterview will create the actual
      interview session through the backend.
    */

    navigate("/startinterview", {
      state: {
        questionsSources,

        // JD
        jobTitle:
          questionsSources === "jd"
            ? jobTitle
            : "",

        jobDescription:
          questionsSources === "jd"
            ? jobDescription
            : "",

        // Topics
        topics:
          questionsSources === "topics"
            ? topics
            : [],

        // Resume
        resumeFile:
          questionsSources === "resume"
            ? resumeFile
            : null,

        // Difficulty
        experienceLevel:
          experienceLevel || "junior",
      },
    });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#030712] via-[#070f2b] to-[#0f172a] px-6 py-10 text-[#eaecf0]">

      {/* Background Glow */}
      <div className="absolute -left-32 -top-40 h-[380px] w-[380px] rounded-full bg-[#d90000]/20 blur-[170px]" />

      <div className="absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-[#6366f1]/20 blur-[220px]" />

      <div className="relative mx-auto max-w-5xl">

        {/* Logo */}
        <div className="mb-8 flex items-center gap-2">
          <span className="text-2xl font-bold text-white">
            AceGrad
            <span className="text-[#d90000]">
              AI
            </span>
          </span>
        </div>

        {/* Greeting */}
        <p className="text-lg text-[#eaecf0]">
          Hi{" "}
          {user?.fullname?.split(" ")[0] ||
            "there"}
          !
        </p>

        <h1 className="mt-1 text-3xl font-bold text-white md:text-4xl">
          Welcome to your AI Interview
        </h1>

        <p className="mt-2 text-[rgba(234,236,240,0.6)]">
          Before starting, we'll be running a
          short system check to make sure
          everything works seamlessly.
        </p>

        {/* System Check */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">

          {/* Left Card */}
          <div className="rounded-3xl border border-[rgba(255,255,255,0.10)] bg-[#0d1538]/80 p-6 backdrop-blur-xl">

            <ChecklistItem
              icon={<Wifi size={18} />}
              label="Internet speed"
              status={internetOk}
            />

            <ChecklistItem
              icon={<Wifi size={18} />}
              label="Camera and microphone access"
              status={cameraOk}
            />

            <MicTestStep
              onComplete={() =>
                setMicOk(true)
              }
              disabled={
                cameraOk === false
              }
              stream={stream}
            />

          </div>

          {/* Camera Preview */}
          <CameraPreview
            videoRef={videoRef}
            cameraOk={cameraOk}
            candidateName={
              user?.fullname
            }
          />

        </div>

        {/* Start Button */}
        <div className="mt-8 flex justify-end">

          <button
            type="button"
            onClick={
              handleStartInterview
            }
            disabled={
              !allChecksPassed ||
              loading
            }
            className="rounded-xl bg-gradient-to-r from-[#d90000] to-[#6366f1] px-8 py-3 font-semibold text-white transition-all hover:from-[#b91c1c] hover:to-[#4f46e5] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading
              ? "Preparing Interview..."
              : "Start Interview"}
          </button>

        </div>

      </div>
    </div>
  );
}