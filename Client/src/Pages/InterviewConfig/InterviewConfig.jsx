import { useState } from "react";
import { X } from "lucide-react";
import { TABS } from "./constant";
import JDTab from "./JDTab";
import ResumeTab from "./ResumeTab";
import TopicsTab from "./TopicsTab";
import { useNavigate } from "react-router-dom";
import { candidateToast } from "../../utils/toast";

export default function InterviewConfig({ onClose }) {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("jd");

  // Difficulty is required only for Topics.
  // JD and Resume will automatically use "junior".
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [customTopic, setCustomTopic] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // ==================================================
  // TOPICS
  // ==================================================

  const toggleTopic = (topic) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic],
    );
  };

  const addCustomTopic = () => {
    const trimmed = customTopic.trim();

    if (!trimmed) {
      return;
    }

    if (!selectedTopics.includes(trimmed)) {
      setSelectedTopics((prev) => [...prev, trimmed]);
    }

    setCustomTopic("");
  };

  // ==================================================
  // CONTINUE
  // ==================================================

  const handleSubmit = (e) => {
    e.preventDefault();

    if (loading) return;

    // -----------------------------------------------
    // JD VALIDATION
    // -----------------------------------------------

    if (activeTab === "jd") {
      if (!jobTitle.trim()) {
        candidateToast.error("Please enter Job Title.");
        return;
      }

      if (!jobDescription.trim()) {
        candidateToast.error("Please enter Job Description.");
        return;
      }
    }

    // -----------------------------------------------
    // TOPICS VALIDATION
    // -----------------------------------------------

    if (activeTab === "topics") {
      if (selectedTopics.length === 0) {
        candidateToast.error("Please select at least one interview topic.");
        return;
      }

      if (!selectedDifficulty) {
        candidateToast.error("Please select a difficulty level.");
        return;
      }
    }

    // -----------------------------------------------
    // RESUME VALIDATION
    // -----------------------------------------------

    if (activeTab === "resume") {
      if (!resumeFile) {
        candidateToast.error("Please upload your resume PDF.");
        return;
      }

      // Backend currently supports PDF resume.
      if (resumeFile.type !== "application/pdf") {
        candidateToast.error("Only PDF resume is supported.");
        return;
      }

      // 5 MB validation
      const maxSize = 5 * 1024 * 1024;

      if (resumeFile.size > maxSize) {
        candidateToast.error("Resume size must be less than 5MB.");
        return;
      }
    }

    // -----------------------------------------------
    // BUILD INTERVIEW CONFIG
    // -----------------------------------------------

    const interviewConfig = {
      questionsSources: activeTab,

      // JD
      jobTitle: activeTab === "jd" ? jobTitle.trim() : "",

      jobDescription: activeTab === "jd" ? jobDescription.trim() : "",

      // Topics
      topics: activeTab === "topics" ? selectedTopics : [],

      // Resume
      resumeFile: activeTab === "resume" ? resumeFile : null,

      // Topics gets selected difficulty.
      // JD + Resume default to junior.
      experienceLevel: activeTab === "topics" ? selectedDifficulty : "junior",
    };

    console.log("Interview Configuration:", interviewConfig);

    // -----------------------------------------------
    // MOVE TO INTERVIEW SETUP
    // -----------------------------------------------

    navigate("/interviewsetup", {
      state: interviewConfig,
    });

    onClose?.();
  };

  // ==================================================
  // UI
  // ==================================================

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-[rgba(255,255,255,0.10)] bg-[#0d1538]/95 shadow-2xl backdrop-blur-xl">
        {/* ========================================= */}
        {/* CLOSE BUTTON */}
        {/* ========================================= */}

        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-[rgba(234,236,240,0.6)] transition hover:bg-white/10 hover:text-white"
        >
          <X size={20} />
        </button>

        {/* ========================================= */}
        {/* HEADER */}
        {/* ========================================= */}

        <div className="p-6 pb-0">
          <h2 className="text-2xl font-bold text-white">
            Configure Your Interview
          </h2>

          <p className="mt-1 text-sm text-[rgba(234,236,240,0.6)]">
            Choose how you'd like to prepare for your mock interview.
          </p>
        </div>

        {/* ========================================= */}
        {/* TABS */}
        {/* ========================================= */}

        <div className="mt-6 flex gap-2 overflow-x-auto border-b border-[rgba(255,255,255,0.10)] px-6">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex shrink-0 items-center gap-2 rounded-t-xl px-4 py-3 text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "border-b-2 border-[#d90000] text-white"
                  : "text-[rgba(234,236,240,0.6)] hover:text-white"
              }`}
            >
              <tab.icon size={18} />

              {tab.label}
            </button>
          ))}
        </div>

        {/* ========================================= */}
        {/* TAB CONTENT */}
        {/* ========================================= */}

        <div className="p-6">
          {/* --------------------------------------- */}
          {/* JD */}
          {/* --------------------------------------- */}

          {activeTab === "jd" && (
            <JDTab
              jobTitle={jobTitle}
              onJobTitleChange={setJobTitle}
              jobDescription={jobDescription}
              onJobDescriptionChange={setJobDescription}
            />
          )}

          {/* --------------------------------------- */}
          {/* RESUME */}
          {/* --------------------------------------- */}

          {activeTab === "resume" && (
            <ResumeTab
              resumeFile={resumeFile}
              onResumeFileChange={setResumeFile}
            />
          )}

          {/* --------------------------------------- */}
          {/* TOPICS */}
          {/* --------------------------------------- */}

          {activeTab === "topics" && (
            <TopicsTab
              selectedTopics={selectedTopics}
              onToggleTopic={toggleTopic}
              customTopic={customTopic}
              onCustomTopicChange={setCustomTopic}
              onAddCustomTopic={addCustomTopic}
              selectedDifficulty={selectedDifficulty}
              onSelectDifficulty={setSelectedDifficulty}
            />
          )}
        </div>

        {/* ========================================= */}
        {/* FOOTER */}
        {/* ========================================= */}

        <div className="flex justify-end gap-3 border-t border-[rgba(255,255,255,0.10)] p-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[rgba(255,255,255,0.10)] px-5 py-2.5 font-medium text-[#eaecf0] transition hover:bg-white/5"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-xl bg-gradient-to-r from-[#d90000] to-[#6366f1] px-6 py-2.5 font-semibold text-white transition-all hover:from-[#b91c1c] hover:to-[#4f46e5]"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
