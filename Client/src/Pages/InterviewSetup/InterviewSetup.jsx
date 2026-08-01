import { useState } from "react";
import { Wifi, Video } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useInternetCheck } from "./hooks/useInternetCheck";
import { useCameraStream } from "./hooks/useCameraStream";
import ChecklistItem from "./components/ChecklistItem";
import MicTestStep from "./components/MicTestSetup";
import CameraPreview from "./components/CameraPreview";
import {useNavigate } from "react-router-dom";

export default function InterviewSetup() {
  const navigate=useNavigate();
  const { user } = useAuth();
  const internetOk = useInternetCheck();
  const { videoRef, cameraOk, stream } = useCameraStream();   // sirf EK baar, stream sahit
  const [micOk, setMicOk] = useState(false);
  const [loading,setLoading]=useState(false);

  const allChecksPassed = internetOk && cameraOk && micOk;
 
  const handleData=async()=>{
     
    try {
      
    } catch (error) {
      
    }finally{

    }
  }


  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#030712] via-[#070f2b] to-[#0f172a] px-6 py-10 text-[#eaecf0]">
      <div className="absolute -top-40 -left-32 h-[380px] w-[380px] rounded-full bg-[#d90000]/20 blur-[170px]" />
      <div className="absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-[#6366f1]/20 blur-[220px]" />

      <div className="relative mx-auto max-w-5xl">
        <div className="mb-8 flex items-center gap-2">
          <span className="text-2xl font-bold text-white">
            AceGrad<span className="text-[#d90000]">AI</span>
          </span>
        </div>

        <p className="text-lg text-[#eaecf0]">Hi {user?.fullname?.split(" ")[0] || "there"}!</p>
        <h1 className="mt-1 text-3xl font-bold text-white md:text-4xl">
          Welcome to your AI Interview
        </h1>
        <p className="mt-2 text-[rgba(234,236,240,0.6)]">
          Before starting, we'll be running a short system check to make sure everything works seamlessly.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-[rgba(255,255,255,0.10)] bg-[#0d1538]/80 backdrop-blur-xl p-6">
            <ChecklistItem icon={<Wifi size={18} />} label="Internet speed" status={internetOk} />
            <ChecklistItem icon={<Video size={18} />} label="Camera and microphone access" status={cameraOk} />
            <MicTestStep
              onComplete={() => setMicOk(true)}
              disabled={cameraOk === false}
              stream={stream}
            />
          </div>

          <CameraPreview videoRef={videoRef} cameraOk={cameraOk} candidateName={user?.fullname} />
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={()=>{navigate('/startinterview')}}
            disabled={!allChecksPassed}
            className="rounded-xl bg-gradient-to-r from-[#d90000] to-[#6366f1] px-8 py-3 font-semibold text-white transition-all hover:from-[#b91c1c] hover:to-[#4f46e5] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Start Interview
          </button>
        </div>
      </div>
    </div>
  );
}