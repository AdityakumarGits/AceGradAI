import { Radio, Video } from "lucide-react";
import { useCameraStream } from "../InterviewSetup/hooks/useCameraStream";
import CameraPreview from "../InterviewSetup/components/CameraPreview";

export default function CameraSection({
  isRecording,
  candidateName,
}) {
  const {
    videoRef,
    cameraOk,
  } = useCameraStream();

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0d1538]/80 p-5 backdrop-blur-xl">

      {/* Header */}
      <div className="mb-3 flex items-center justify-between">

        <div className="flex items-center gap-2">
          <Video
            size={16}
            className="text-[#d90000]"
          />

          <span className="text-sm font-semibold text-white">
            Camera
          </span>
        </div>

        {isRecording && (
          <div className="flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-1">

            <Radio
              size={12}
              className="animate-pulse text-red-400"
            />

            <span className="text-[10px] font-semibold uppercase tracking-wider text-red-400">
              REC
            </span>

          </div>
        )}

      </div>

      {/* Video */}
      <div className="min-h-0 flex-1 overflow-hidden rounded-xl">

        <CameraPreview
          videoRef={videoRef}
          cameraOk={cameraOk}
          candidateName={candidateName}
        />

      </div>

    </div>
  );
}