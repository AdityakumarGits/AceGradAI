import { useState } from "react";
import { X } from "lucide-react";
import { TABS } from "./constant";
import JDTab from "./JDTab";
import ResumeTab from "./ResumeTab";
import TopicsTab from "./TopicsTab";
import { useNavigate } from "react-router-dom";
import { candidateToast } from "../../utils/toast";
import axios from "axios";
import API from "../../services/api";

export default function InterviewConfig({ onClose }) {
  const [activeTab, setActiveTab] = useState("jd");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [customTopic, setCustomTopic] = useState("");

 const [jobTitle,setJobTitle ]=useState("")
 const [jobDescription,SetJobDescription]=useState("");
 const [loading,setLoading]=useState(false);


 const handleSubmit=async(e)=>{
     e.preventDefault();
   if(!jobDescription  || !jobTitle){
      candidateToast.error("Job Title or Job Description are Missing");
    return 
   }
   navigate("/interviewsetup", {
        state: { jobTitle, jobDescription }
    });
    onClose?.();  
    
  }


 const navigate=useNavigate();
  const toggleTopic = (topic) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const addCustomTopic = () => {
    const trimmed = customTopic.trim();
    if (trimmed && !selectedTopics.includes(trimmed)) {
      setSelectedTopics((prev) => [...prev, trimmed]);
    }
    setCustomTopic("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg rounded-3xl border border-[rgba(255,255,255,0.10)] bg-[#0d1538]/95 backdrop-blur-xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          

          className="absolute right-4 top-4 rounded-full p-1.5 text-[rgba(234,236,240,0.6)] transition hover:bg-white/10 hover:text-white"
        >
          <X size={20} />
        </button>

        <div className="p-6 pb-0">
          <h2 className="text-2xl font-bold text-white">Configure Your Interview</h2>
          <p className="mt-1 text-sm text-[rgba(234,236,240,0.6)]">
            Choose how you'd like to prepare for your mock interview.
          </p>
        </div>

        <div className="mt-6 flex gap-2 border-b border-[rgba(255,255,255,0.10)] px-6">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
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

        <div className="p-6">
          {activeTab === "jd" && 
          <JDTab
        jobTitle={jobTitle}
        onJobTitleChange={setJobTitle}
        jobDescription={jobDescription}
        onJobDescriptionChange={SetJobDescription}
     />}

          {activeTab === "resume" && (
            <ResumeTab
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