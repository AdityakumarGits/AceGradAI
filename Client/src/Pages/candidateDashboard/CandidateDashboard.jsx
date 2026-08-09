import  {useEffect, useState } from "react";
import OverviewSection from "./OverviewSection";
import HistorySection from "./HistorySection";
import AnalyticsSection from "./AnalyticsSection";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; 
import InterviewConfig from "../InterviewConfig/InterviewConfig";


import { LayoutDashboard, History, BarChart3, Flame, LogOut, UserCircle2, Rocket,} from "lucide-react";
import { candidateToast } from "../../utils/toast";

export default function CandidateDashboard() {
    const navigate = useNavigate();
  const { logout, user } = useAuth(); 
  const [activeTab, setActiveTab] = useState("overview");
  const [interviews,setInterviews]=useState([]);
  const [loading,setLoading]=useState(true);
  const [showConfigModal, setShowConfigModal] = useState(false);
 

  const handleData=async()=>{

    try {
      setLoading(true);

      const response=await API.get("/interview/getAllInterviews")
        setInterviews(response.data.data.interviews);
        // pehla .data = axios ka wrapper
        // dusra .data = tumhare backend controller ka apna wrapper object
        // .interviews = asli array

        
      
      
      console.log(response.data);
      
    } catch (error) {
       console.log(error);
       candidateToast.error("Something went wrong");
    }finally{
      setLoading(false);
    }
  }
  useEffect(() => {
    handleData();
}, []);

 const handleLogout=async()=>{
    try {
     await API.post("auth/logout");
    } catch (error) {
      console.error("Backend logout error, clearing local session anyway:", error);
    }finally{
       logout();
     navigate("/", { replace: true });
    
    // Page reload taaki memory se state flush ho jaye aur routes secure ho sakein
   
    }
  } 
 const voices = window.speechSynthesis.getVoices();
console.log(voices); // dekho kya-kya available hai tumhare system pe

  const renderSection = () => {
    switch (activeTab) {
        case "overview":
             return (
                <OverviewSection
                    interviews={interviews}
                    loading={loading}
                    setActiveTab={setActiveTab}
                    onStartInterview={() => setShowConfigModal(true)}
                />
            );
        case "history":
            return <HistorySection interviews={interviews} loading={loading} />;

        case "analytics":
            return <AnalyticsSection interviews={interviews} loading={loading} />;

        default:
          return (
        <OverviewSection
            interviews={interviews}
            loading={loading}
            setActiveTab={setActiveTab}
            onStartInterview={() => setShowConfigModal(true)}
        />
    );

          }
};

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#030712] via-[#070f2b] to-[#0f172a] text-[#eaecf0]">
      {/* Sidebar */}

      <aside className="w-72 border-r border-white/10 bg-[#0d1538]/80 backdrop-blur-xl flex flex-col justify-between">
        {/* Logo */}

        <div className="p-7">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#d90000] to-indigo-600 shadow-lg">
              <Rocket className="text-white" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white">AceGrad AI</h2>

              <p className="text-xs text-[#eaecf0]/60">Interview Platform</p>
            </div>
          </div>

          {/* Navigation */}

          <nav className="mt-12 space-y-4">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex w-full items-center gap-4 rounded-2xl px-5 py-4 transition-all duration-300 ${
                activeTab === "overview"
                  ? "bg-gradient-to-r from-[#d90000] to-indigo-600 text-white shadow-[0_0_25px_rgba(217,0,0,.25)]"
                  : "bg-white/5 text-[#eaecf0]/70 hover:bg-white/10"
              }`}
            >
              <LayoutDashboard size={20} />
              Dashboard
            </button>

            <button
              onClick={() => setActiveTab("history")}
              className={`flex w-full items-center gap-4 rounded-2xl px-5 py-4 transition-all duration-300 ${
                activeTab === "history"
                  ? "bg-gradient-to-r from-[#d90000] to-indigo-600 text-white shadow-[0_0_25px_rgba(217,0,0,.25)]"
                  : "bg-white/5 text-[#eaecf0]/70 hover:bg-white/10"
              }`}
            >
              <History size={20} />
              Interview History
            </button>

            <button
              onClick={() => setActiveTab("analytics")}
              className={`flex w-full items-center gap-4 rounded-2xl px-5 py-4 transition-all duration-300 ${
                activeTab === "analytics"
                  ? "bg-gradient-to-r from-[#d90000] to-indigo-600 text-white shadow-[0_0_25px_rgba(217,0,0,.25)]"
                  : "bg-white/5 text-[#eaecf0]/70 hover:bg-white/10"
              }`}
            >
              <BarChart3 size={20} />
              Analytics
            </button>
          </nav>
        </div>

        {/* Profile */}

        <div className="border-t border-white/10 p-6">
          <div className="rounded-2xl bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#d90000] to-indigo-600">
                  <UserCircle2 className="text-white" />
                </div>

                <div>
                  <h4 className="font-semibold text-white">{user?.fullname}</h4>
                   <p className="text-xs text-[#eaecf0]/60">{user?.role}</p>
                </div>
              </div>

              <button
              type="button"
              onClick={handleLogout} 
               className="rounded-xl p-2 transition hover:bg-red-500/20">
                <LogOut className="text-[#d90000]" size={20} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}

      <main className="flex-1 overflow-y-auto px-10 py-8">
        {/* Header */}

        <header className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white">
              Welcome Back,
              <span className="bg-gradient-to-r from-[#d90000] to-indigo-400 bg-clip-text text-transparent">
                {" "}
               {user?.fullname?.split(" ")[0]}
              </span>
            </h1>

            <p className="mt-2 text-[#eaecf0]/60">
              Continue improving your interview performance with AI-powered mock
              interviews.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-[#d90000]/30 bg-[#d90000]/10 px-5 py-3 text-[#d90000] font-semibold">
            <Flame size={18} />5 Day Streak
          </div>
        </header>

        {/* Dynamic Section */}
        {showConfigModal && (
       <InterviewConfig onClose={() => setShowConfigModal(false)} />
         )}
        <div>{renderSection()}</div>
      </main>
    </div>
  );
}
