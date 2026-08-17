import { useState } from "react";
import { X } from "lucide-react";
import { TABS } from "./constant";
import JDTab from "./JDTab";
import ResumeTab from "./ResumeTab";
import TopicsTab from "./TopicsTab";
import { useNavigate } from "react-router-dom";
import { candidateToast } from "../../utils/toast";
import API from "../../services/api";

export default function InterviewConfig({ onClose }) {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("jd");

  // Backend-compatible values:
  // fresher | junior | senior
  const [selectedDifficulty, setSelectedDifficulty] = useState("");

  const [selectedTopics, setSelectedTopics] = useState([]);
  const [customTopic, setCustomTopic] = useState("");

  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const [resumeFile, setResumeFile] = useState(null);

  const [loading, setLoading] = useState(false);

  // ---------------------------------------
  // Topics
  // ---------------------------------------

  const toggleTopic = (topic) => {
    setSelectedTopics((prev) =>
      prev.includes(topic)
        ? prev.filter((t) => t !== topic)
        : [...prev, topic]
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

  // ---------------------------------------
  // Start Interview
  // ---------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;
// Only Topics requires difficulty selection
  if (activeTab === "topics" && !selectedDifficulty) {
    candidateToast.error("Please select a difficulty level.");
    return;
  }

    try {
      setLoading(true);


      // =====================================
      // JD INTERVIEW
      // =====================================
const experienceLevel =
      activeTab === "topics"
        ? selectedDifficulty
        : "junior";

    let response;

    //jd
      if (activeTab === "jd") {
        if (!jobTitle.trim()) {
          candidateToast.error("Please enter Job Title.");
          return;
        }

        if (!jobDescription.trim()) {
          candidateToast.error("Please enter Job Description.");
          return;
        }

        response = await API.post("/interview/startInterview", {
          questionsSources: "jd",
          jobTitle: jobTitle.trim(),
          jobDescription: jobDescription.trim(),
          experienceLevel: "junior",
          interviewType: "practice",
        });
      }

      // =====================================
      // TOPICS INTERVIEW
      // =====================================

      if (activeTab === "topics") {
        if (selectedTopics.length === 0) {
          candidateToast.error(
            "Please select at least one interview topic."
          );
          return;
        }

        response = await API.post("/interview/startInterview", {
          questionsSources: "topics",
          topics: selectedTopics,
          experienceLevel,
          interviewType: "practice",
        });
      }

      // =====================================
      // RESUME INTERVIEW
      // =====================================

      if (activeTab === "resume") {
        if (!resumeFile) {
          candidateToast.error("Please upload your resume PDF.");
          return;
        }

        const formData = new FormData();

        formData.append("questionsSources", "resume");
        formData.append( "experienceLevel", "junior");
        formData.append("interviewType", "practice");
        formData.append("resume", resumeFile);

        response = await API.post(
          "/interview/startInterview",
          formData
        );
      }

      // =====================================
      // CHECK RESPONSE
      // =====================================

      const interview = response?.data?.data?.interview;

      if (!interview?._id) {
        throw new Error(
          "Interview session was not created."
        );
      }

      candidateToast.success(
        "Interview created successfully."
      );

      // =====================================
      // MOVE TO INTERVIEW SETUP
      // =====================================

      navigate("/interviewsetup", {
        state: {
          interviewId: interview._id,
          questions: interview.questions || [],
          questionsSources: interview.questionsSources,
        },
      });

      onClose?.();

    } catch (error) {
      console.error(
        "Start Interview Error:",
        error
      );
      console.log("STATUS:", error.response?.status);
  console.log("BACKEND RESPONSE:", error.response?.data);
  console.log("REQUEST DATA:", error.config?.data);


      // const message =
      //   error?.response?.data?.message ||
      //   error?.message ||
      //   "Failed to start interview.";

      candidateToast.error(error.response?.data?.message ||
    "Failed to start interview.");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">

      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border border-[rgba(255,255,255,0.10)] bg-[#0d1538]/95 shadow-2xl backdrop-blur-xl">

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="absolute right-4 top-4 rounded-full p-1.5 text-[rgba(234,236,240,0.6)] transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="p-6 pb-0">
          <h2 className="text-2xl font-bold text-white">
            Configure Your Interview
          </h2>

          <p className="mt-1 text-sm text-[rgba(234,236,240,0.6)]">
            Choose how you'd like to prepare for your mock interview.
          </p>
        </div>

        {/* Tabs */}
        <div className="mt-6 flex gap-2 border-b border-[rgba(255,255,255,0.10)] px-6">

          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              disabled={loading}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-t-xl px-4 py-3 text-sm font-medium transition-all ${
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

        {/* Tab Content */}
        <div className="p-6">

          {activeTab === "jd" && (
            <JDTab
              jobTitle={jobTitle}
              onJobTitleChange={setJobTitle}
              jobDescription={jobDescription}
              onJobDescriptionChange={setJobDescription}
            />
          )}

          {activeTab === "resume" && (
            <ResumeTab
              resumeFile={resumeFile}
              onResumeFileChange={setResumeFile}
              selectedDifficulty={selectedDifficulty}
              onSelectDifficulty={setSelectedDifficulty}
            />
          )}

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

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-[rgba(255,255,255,0.10)] p-6">

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-[rgba(255,255,255,0.10)] px-5 py-2.5 font-medium text-[#eaecf0] transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-xl bg-gradient-to-r from-[#d90000] to-[#6366f1] px-6 py-2.5 font-semibold text-white transition-all hover:from-[#b91c1c] hover:to-[#4f46e5] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Creating Interview..."
              : "Continue"}
          </button>

        </div>

      </div>
    </div>
  );
}